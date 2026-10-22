import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  canonicalId,
  grade,
  isCorrect,
  sampleQuestions,
  validateBank,
} from "../server/engine.js";
import type { Question, Response } from "../shared/types.js";

import { fixture } from "./helpers.js";

test("70% boundary uses correct counts, not rounded display percentages", () => {
  const bank = fixture(60);
  const responses = Object.fromEntries(
    bank
      .slice(0, 42)
      .map((q) => [q.id, { selected: q.correct, flagged: false }]),
  );
  assert.equal(grade(bank, responses).passed, true);
  delete responses[bank[41].id];
  assert.equal(grade(bank, responses).passed, false);
  assert.equal(grade(bank, responses).correctCount, 41);
  for (const count of [57, 58, 59, 60]) {
    const required = Math.ceil(count * 0.7);
    const answers = Object.fromEntries(
      bank
        .slice(0, required)
        .map((q) => [q.id, { selected: q.correct, flagged: false }]),
    );
    assert.equal(grade(bank.slice(0, count), answers).passed, true);
    delete answers[bank[required - 1].id];
    assert.equal(grade(bank.slice(0, count), answers).passed, false);
  }
});
test("multiple answers require the exact set; unanswered, extra, and duplicate choices fail", () => {
  const q = fixture()[0];
  for (const selected of [[], ["A"], ["A", "B", "C"], ["A", "A"]])
    assert.equal(isCorrect(q, { selected, flagged: false }), false);
  assert.equal(isCorrect(q, { selected: ["C", "A"], flagged: false }), true);
  assert.equal(isCorrect(q, undefined), false);
});
test("sampling covers eight objectives, excludes review items, and never repeats a linked question", () => {
  const bank = fixture();
  bank.push({ ...bank[0], id: "duplicate", duplicateOf: bank[0].id });
  bank.push({ ...bank[1], id: "incomplete", status: "needs-review" });
  for (let i = 0; i < 10; i++) {
    const sample = sampleQuestions(bank, 60);
    assert.equal(new Set(sample.map(canonicalId)).size, 60);
    assert.equal(new Set(sample.map((q) => q.topic)).size, 8);
    assert.ok(sample.every((q) => q.status === "ready"));
  }
  assert.throws(() => sampleQuestions(bank, 101), /Only/);
});
test("topic and missed-question study filters are enforced", () => {
  const bank = fixture();
  const sample = sampleQuestions(bank, 5, new Map(), [3]);
  assert.ok(sample.every((q) => q.topic === 3));
  const missed = new Set(bank.slice(0, 10).map((q) => q.id));
  assert.ok(
    sampleQuestions(bank, 10, new Map(), [], missed).every((q) =>
      missed.has(q.id),
    ),
  );
  assert.throws(
    () => sampleQuestions(bank, 11, new Map(), [], missed),
    /Only 10/,
  );
});
test("less-seen questions are preferred within objectives", () => {
  const bank = fixture();
  const seen = new Map(bank.slice(0, 80).map((q) => [q.id, 10]));
  assert.ok(
    sampleQuestions(bank, 8, seen).every(
      (q) => Number(q.id.split("-")[1]) >= 80,
    ),
  );
});
test("all baseline sources are retained and bank structure is valid", () => {
  const bank: Question[] = JSON.parse(
    readFileSync("questions/bank.json", "utf8"),
  );
  validateBank(bank);
  for (let n = 1; n <= 139; n++)
    assert.ok(bank.some((q) => q.id === `md-q${String(n).padStart(3, "0")}`));
  assert.equal(bank.filter((q) => q.source.kind === "screenshot").length, 106);
  const images = readdirSync("questions/sources/screenshots").filter((n) =>
    n.endsWith(".png"),
  );
  assert.equal(images.length, 64);
  assert.equal(
    new Set(
      bank
        .filter((q) => q.source.kind === "screenshot")
        .map((q) => q.source.file),
    ).size,
    64,
  );
  const report = JSON.parse(
    readFileSync("questions/import-report.json", "utf8"),
  );
  for (const file of images)
    assert.equal(
      createHash("sha256")
        .update(readFileSync(`questions/sources/screenshots/${file}`))
        .digest("hex"),
      report.sourceHashes[file],
    );
  assert.ok(bank.some((q) => q.status === "needs-review"));
  assert.ok(sampleQuestions(bank, 60).every((q) => q.status === "ready"));
});
