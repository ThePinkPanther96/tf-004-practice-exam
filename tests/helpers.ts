import type { Question } from "../shared/types.js";
export function fixture(count = 100): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `fixture-${i}`,
    topic: (i % 8) + 1,
    type: i % 3 === 0 ? "multiple" : "single",
    prompt: `Question ${i}?`,
    options: [
      { id: "A", text: "First" },
      { id: "B", text: "Second" },
      { id: "C", text: "Third" },
    ],
    correct: i % 3 === 0 ? ["A", "C"] : ["B"],
    selectCount: i % 3 === 0 ? 2 : 1,
    explanation: "A meaningful explanation.",
    references: [],
    status: "ready",
    notes: [],
    source: {
      kind: "markdown",
      file: "fixture.md",
      number: String(i),
      permission: "Test fixture.",
    },
  }));
}
