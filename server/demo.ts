import { randomUUID } from "node:crypto";
import { grade, sampleQuestions } from "./engine.js";
import type { Store } from "./store.js";
import type { Attempt, Response } from "../shared/types.js";

export function seedEasterEggDemo(
  store: Store,
  owner: string,
  now = Date.now(),
) {
  const existing = store.db
    .prepare(
      "SELECT id FROM attempts WHERE owner=? AND json_extract(data,'$.demo')='pink-floyd-v1'",
    )
    .all(owner);
  if (existing.length)
    return { inserted: 0, ids: existing.map((row) => String(row.id)) };
  const plan = [
    { mode: "exam", count: 60, correct: 36 },
    { mode: "exam", count: 60, correct: 42 },
    { mode: "exam", count: 60, correct: 48 },
    { mode: "exam", count: 60, correct: 54 },
    { mode: "exam", count: 60, correct: 60 },
    { mode: "study", count: 10, correct: 10 },
  ] as const;
  const ids: string[] = [];
  store.db.exec("BEGIN IMMEDIATE");
  try {
    for (const [index, entry] of plan.entries()) {
      const questions = sampleQuestions(store.bank, entry.count);
      const responses: Record<string, Response> = {};
      for (const [i, q] of questions.entries()) {
        const wrong = q.options.find(
          (option) => !q.correct.includes(option.id),
        );
        const selected =
          i < entry.correct
            ? [...q.correct]
            : wrong
              ? [wrong.id, ...q.correct.slice(0, q.selectCount - 1)]
              : [];
        responses[q.id] = {
          selected,
          flagged: false,
          checked: entry.mode === "study",
        };
      }
      const createdAt = now - (plan.length - index) * 86400000;
      const attempt: Omit<Attempt, "serverNow"> = {
        id: randomUUID(),
        demo: "pink-floyd-v1",
        mode: entry.mode,
        status: "submitted",
        createdAt,
        deadline: entry.mode === "exam" ? createdAt + 3600000 : null,
        submittedAt: createdAt + (entry.mode === "exam" ? 42 : 8) * 60000,
        count: entry.count,
        passThreshold: 70,
        questions,
        responses,
        ...grade(questions, responses),
        submissionReason: "manual",
      };
      store.db
        .prepare("INSERT INTO attempts(id,owner,data) VALUES(?,?,?)")
        .run(attempt.id, owner, JSON.stringify(attempt));
      ids.push(attempt.id);
    }
    store.db.exec("COMMIT");
    return { inserted: ids.length, ids };
  } catch (error) {
    store.db.exec("ROLLBACK");
    throw error;
  }
}
