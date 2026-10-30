import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Store } from "../server/store.js";
import { fixture } from "./helpers.js";

test("exam answers stay hidden until submission and attempts are scoped to a browser", () => {
  const store = new Store(":memory:", fixture());
  try {
    const a = store.create("alice", "exam", 60, [], false);
    assert.equal(a.count, 60);
    assert.equal(a.deadline! - a.createdAt, 3600000);
    for (const q of a.questions) {
      assert.ok(!("correct" in q));
      assert.ok(!("explanation" in q));
      assert.ok(!("sourceAnswer" in q));
    }
    assert.throws(() => store.get("bob", a.id), /not found/);
    assert.throws(
      () => store.create("alice", "exam", 60, [], false),
      /already active/,
    );
    assert.throws(() => store.check("alice", a.id, a.questions[0].id), /only/);
    const done = store.submit("alice", a.id);
    assert.equal(done.status, "submitted");
    assert.equal(done.score, 0);
    assert.ok(done.questions.every((q) => "correct" in q));
    assert.equal(store.submit("alice", a.id).submittedAt, done.submittedAt);
    assert.throws(
      () => store.answer("alice", a.id, a.questions[0].id, ["B"], false),
      /submitted/,
    );
  } finally {
    store.close();
  }
});
test("deadline finalizes at the original time, rejects late answers, and updates history without a worker", () => {
  let now = 100000;
  const store = new Store(":memory:", fixture(), () => now);
  try {
    const a = store.create("alice", "exam", 57, [], false),
      q = a.questions[0];
    store.answer("alice", a.id, q.id, ["A"], true);
    now = a.deadline! - 1;
    assert.equal(store.get("alice", a.id).status, "active");
    now = a.deadline!;
    assert.throws(
      () => store.answer("alice", a.id, q.id, ["B"], false),
      /submitted/,
    );
    const done = store.get("alice", a.id);
    assert.equal(done.status, "submitted");
    assert.equal(done.submittedAt, a.deadline);
    assert.equal(done.submissionReason, "timeout");
    assert.deepEqual(done.responses[q.id].selected, ["A"]);
    assert.equal(store.dashboard("alice").active.length, 0);
    assert.equal(store.dashboard("alice").history.length, 1);
  } finally {
    store.close();
  }
});
test("restart preserves answers, deadline, browser isolation, and original question snapshots", () => {
  const dir = mkdtempSync(join(tmpdir(), "terraprep-test-")),
    path = join(dir, "db.sqlite");
  const bank = fixture();
  let store = new Store(path, bank);
  try {
    const a = store.create("alice", "exam", 60, [], false),
      q = a.questions[0];
    store.answer("alice", a.id, q.id, ["A"], true);
    store.close();
    const changed = structuredClone(bank);
    changed.find((x) => x.id === q.id)!.prompt = "Changed bank prompt";
    store = new Store(path, changed);
    const restored = store.get("alice", a.id);
    assert.equal(restored.deadline, a.deadline);
    assert.equal(restored.questions[0].prompt, q.prompt);
    assert.deepEqual(restored.responses[q.id], {
      selected: ["A"],
      flagged: true,
      checked: false,
    });
    assert.throws(() => store.get("other", a.id), /not found/);
  } finally {
    store.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
test("whole-subject study results remain in progress after a restart", () => {
  const dir = mkdtempSync(join(tmpdir(), "terraprep-subject-"));
  const path = join(dir, "db.sqlite");
  const bank = fixture(128);
  let store = new Store(path, bank);
  try {
    const attempt = store.create("alice", "study", "all", [1], false);
    assert.equal(attempt.count, 16);
    for (const q of attempt.questions.slice(0, 14)) {
      store.answer(
        "alice",
        attempt.id,
        q.id,
        bank.find((b) => b.id === q.id)!.correct,
        false,
      );
    }
    store.submit("alice", attempt.id);
    store.close();
    store = new Store(path, bank);
    const progress = store.dashboard("alice");
    assert.equal(progress.active.length, 0);
    assert.equal(progress.history.length, 1);
    assert.equal(progress.history[0].id, attempt.id);
    assert.equal(progress.history[0].mode, "study");
    assert.equal(progress.history[0].count, 16);
    assert.equal(progress.history[0].correctCount, 14);
    assert.equal(progress.history[0].score, 87.5);
    assert.equal(progress.topics[0].accuracy, 87.5);
    assert.equal(store.dashboard("bob").history.length, 0);
  } finally {
    store.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
test("study checking reveals only that answer, locks it, and has no deadline", () => {
  const bank = fixture(),
    store = new Store(":memory:", bank);
  try {
    const a = store.create("alice", "study", 5, [2], false),
      q = a.questions[0],
      correct = bank.find((x) => x.id === q.id)!.correct;
    assert.equal(a.deadline, null);
    assert.throws(() => store.check("alice", a.id, q.id), /Select/);
    store.answer("alice", a.id, q.id, correct, false);
    const checked = store.check("alice", a.id, q.id);
    assert.ok("correct" in checked.questions[0]);
    assert.ok(!("correct" in checked.questions[1]));
    assert.throws(
      () => store.answer("alice", a.id, q.id, [], false),
      /cannot be changed/,
    );
    store.answer("alice", a.id, q.id, correct, true);
    const done = store.submit("alice", a.id);
    assert.equal(done.correctCount, 1);
    const weak = store.create("alice", "study", 4, [], true);
    assert.ok(
      weak.questions.every(
        (x) => x.id !== q.id && a.questions.some((old) => old.id === x.id),
      ),
    );
  } finally {
    store.close();
  }
});
test("invalid option IDs, excessive selections, and questions outside the attempt cannot be stored", () => {
  const store = new Store(":memory:", fixture());
  try {
    const a = store.create("alice", "study", 10, [], false),
      single = a.questions.find((q) => q.type === "single")!;
    assert.throws(
      () => store.answer("alice", a.id, single.id, ["X"], false),
      /Invalid/,
    );
    assert.throws(
      () => store.answer("alice", a.id, single.id, ["A", "B"], false),
      /Invalid/,
    );
    assert.throws(
      () => store.answer("alice", a.id, single.id, ["B", "B"], false),
      /Invalid/,
    );
    assert.throws(
      () => store.answer("alice", a.id, "not-in-exam", ["A"], false),
      /not found/,
    );
  } finally {
    store.close();
  }
});
