import { test } from "node:test";
import assert from "node:assert/strict";
import { Store } from "../server/store.js";
import { seedEasterEggDemo } from "../server/demo.js";
import { isFloydSearch } from "../shared/easterEggs.js";
import { fixture } from "./helpers.js";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BrickMilestone } from "../src/EasterEggs.js";

test("the brick milestone starts at five completed exams and has exactly five bricks", () => {
  assert.equal(
    renderToStaticMarkup(createElement(BrickMilestone, { count: 4 })),
    "",
  );
  for (const count of [5, 12]) {
    const markup = renderToStaticMarkup(
      createElement(BrickMilestone, { count }),
    );
    assert.match(markup, /Another Brick in the Wall/);
    assert.equal((markup.match(/<rect /g) ?? []).length, 5);
  }
});

test("secret search accepts capitalization and spacing without matching normal questions", () => {
  assert.ok(isFloydSearch("  Pink   FLOYD "));
  assert.equal(isFloydSearch("pink floyd terraform"), false);
  assert.equal(isFloydSearch("terraform state"), false);
});
test("demo seed provides five graded exams and a perfect study session without changing other progress", () => {
  const store = new Store(":memory:", fixture());
  try {
    const real = store.create("tester", "study", 5, [], false);
    store.create("other", "study", 1, [], false);
    const result = seedEasterEggDemo(store, "tester", Date.now());
    assert.equal(result.inserted, 6);
    const dashboard = store.dashboard("tester");
    assert.deepEqual(
      dashboard.history
        .filter((a) => a.mode === "exam")
        .map((a) => a.score)
        .sort((a, b) => a! - b!),
      [60, 70, 80, 90, 100],
    );
    assert.equal(
      dashboard.history.filter((a) => a.mode === "study")[0].score,
      100,
    );
    assert.ok(dashboard.history.every((a) => a.demo === "pink-floyd-v1"));
    assert.equal(dashboard.active[0].id, real.id);
    assert.equal(store.dashboard("other").history.length, 0);
    assert.equal(seedEasterEggDemo(store, "tester").inserted, 0);
    assert.equal(store.dashboard("tester").history.length, 6);
    const perfect = dashboard.history.find(
      (a) => a.mode === "exam" && a.score === 100,
    )!;
    const attempt = store.get("tester", perfect.id);
    assert.ok(
      attempt.questions.every(
        (q) =>
          "correct" in q &&
          q.correct.every((answer) =>
            attempt.responses[q.id].selected.includes(answer),
          ),
      ),
    );
  } finally {
    store.close();
  }
});
