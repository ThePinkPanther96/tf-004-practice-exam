import { randomInt } from "node:crypto";
import type { Question, Response } from "../shared/types.js";

export function shuffle<T>(values: T[]): T[] {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
export function isCorrect(question: Question, response?: Response): boolean {
  const selected = response?.selected ?? [];
  return (
    selected.length === question.correct.length &&
    new Set(selected).size === selected.length &&
    question.correct.every((id) => selected.includes(id))
  );
}
export function grade(
  questions: Question[],
  responses: Record<string, Response>,
  threshold = 70,
) {
  const correctCount = questions.filter((q) =>
    isCorrect(q, responses[q.id]),
  ).length;
  const score = (correctCount / questions.length) * 100;
  return {
    correctCount,
    score,
    passed: correctCount * 100 >= questions.length * threshold,
  };
}
export function canonicalId(q: Question) {
  return q.duplicateOf ?? q.id;
}

// Round-robin across shuffled objective buckets: every available objective gets coverage.
// Prioritize less-seen entries, retaining randomness among equally exposed questions.
export function sampleQuestions(
  bank: Question[],
  count: number | "all",
  seen: Map<string, number> = new Map(),
  topics: number[] = [],
  weakIds?: Set<string>,
) {
  const eligible = bank.filter(
    (q) =>
      q.status === "ready" &&
      (!topics.length || topics.includes(q.topic)) &&
      (!weakIds || weakIds.has(canonicalId(q))),
  );
  const groups = new Map<string, Question[]>();
  for (const q of eligible) {
    const key = canonicalId(q);
    groups.set(key, [...(groups.get(key) ?? []), q]);
  }
  const unique = [...groups.values()].map(
    (group) =>
      shuffle(group).sort(
        (a, b) => (seen.get(a.id) ?? 0) - (seen.get(b.id) ?? 0),
      )[0],
  );
  const targetCount = count === "all" ? unique.length : count;
  if (!unique.length)
    throw new Error(
      "No unique, ready questions match these settings. Choose more topics or turn off the missed-question filter.",
    );
  if (unique.length < targetCount)
    throw new Error(
      `Only ${unique.length} unique, ready questions match these settings. Choose a smaller study session or more topics.`,
    );
  const buckets = new Map<number, Question[]>();
  for (const q of shuffle(unique).sort(
    (a, b) => (seen.get(canonicalId(a)) ?? 0) - (seen.get(canonicalId(b)) ?? 0),
  ))
    buckets.set(q.topic, [...(buckets.get(q.topic) ?? []), q]);
  const result: Question[] = [];
  const order = shuffle([...buckets.keys()]);
  while (result.length < targetCount)
    for (const topic of order) {
      const q = buckets.get(topic)!.shift();
      if (q && result.length < targetCount) result.push(q);
    }
  // Preserve option order: options such as "all of the above" are position-dependent.
  return shuffle(result);
}
export function validateBank(bank: Question[]) {
  const ids = new Set<string>();
  for (const q of bank) {
    if (ids.has(q.id)) throw new Error(`Duplicate entry ID: ${q.id}`);
    ids.add(q.id);
    if (!q.prompt.trim() || q.topic < 1 || q.topic > 8)
      throw new Error(`Invalid question ${q.id}`);
    if (q.status === "ready") {
      const options = q.options.map((o) => o.id);
      if (
        options.length < 2 ||
        new Set(options).size !== options.length ||
        !q.correct.length ||
        q.correct.some((id) => !options.includes(id)) ||
        new Set(q.correct).size !== q.correct.length
      )
        throw new Error(`Invalid answer/options: ${q.id}`);
      if (q.type !== "multiple" && q.correct.length !== 1)
        throw new Error(`Invalid single answer: ${q.id}`);
      if (q.selectCount !== q.correct.length)
        throw new Error(`Invalid selection count: ${q.id}`);
    }
  }
  for (const q of bank)
    if (
      q.duplicateOf &&
      (!ids.has(q.duplicateOf) ||
        bank.find((other) => other.id === q.duplicateOf)?.duplicateOf)
    )
      throw new Error(`Invalid duplicate link: ${q.id}`);
}
