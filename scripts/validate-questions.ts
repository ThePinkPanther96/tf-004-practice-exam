import { readFileSync } from "node:fs";
import type { Question } from "../shared/types.js";
import { canonicalId, validateBank } from "../server/engine.js";
const bank: Question[] = JSON.parse(
  readFileSync("questions/bank.json", "utf8"),
);
validateBank(bank);
const ready = bank.filter((q) => q.status === "ready");
console.log(
  JSON.stringify(
    {
      total: bank.length,
      ready: ready.length,
      uniqueReady: new Set(ready.map(canonicalId)).size,
      needsReview: bank
        .filter((q) => q.status !== "ready")
        .map((q) => ({ id: q.id, notes: q.notes })),
    },
    null,
    2,
  ),
);
