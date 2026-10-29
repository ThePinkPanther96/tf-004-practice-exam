import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import {
  canonicalId,
  grade,
  isCorrect,
  sampleQuestions,
  validateBank,
} from "./engine.js";
import {
  TOPICS,
  type Attempt,
  type AttemptSummary,
  type Dashboard,
  type Question,
  type Response,
} from "../shared/types.js";

type Stored = Omit<Attempt, "serverNow" | "questions"> & {
  questions: Question[];
};
export class Store {
  db: DatabaseSync;
  bank: Question[];
  constructor(
    path = process.env.DB_PATH ?? resolve("data/terraprep.sqlite"),
    bank?: Question[],
    private now = () => Date.now(),
  ) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(
      "PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;",
    );
    this.db
      .exec(`CREATE TABLE IF NOT EXISTS questions(id TEXT PRIMARY KEY, content TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS attempts(id TEXT PRIMARY KEY, owner TEXT NOT NULL, data TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS attempts_owner ON attempts(owner);`);
    this.bank =
      bank ?? JSON.parse(readFileSync(resolve("questions/bank.json"), "utf8"));
    validateBank(this.bank);
    const insert = this.db.prepare(
      "INSERT INTO questions(id,content) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET content=excluded.content",
    );
    this.db.exec("BEGIN");
    try {
      for (const q of this.bank) insert.run(q.id, JSON.stringify(q));
      this.db.exec("COMMIT");
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
    // Older source entries remain available even if a later import omits them.
    this.bank = (
      this.db.prepare("SELECT content FROM questions ORDER BY id").all() as {
        content: string;
      }[]
    ).map((row) => JSON.parse(row.content));
  }
  private save(owner: string, a: Stored) {
    this.db
      .prepare(
        "INSERT INTO attempts(id,owner,data) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data",
      )
      .run(a.id, owner, JSON.stringify(a));
  }
  private finish(owner: string, a: Stored, reason: "manual" | "timeout") {
    if (a.status === "submitted") return a;
    const result = grade(a.questions, a.responses, a.passThreshold);
    Object.assign(a, result, {
      status: "submitted",
      submittedAt: reason === "timeout" ? a.deadline : this.now(),
      submissionReason: reason,
    });
    this.save(owner, a);
    return a;
  }
  private read(owner: string, id: string) {
    const row = this.db
      .prepare("SELECT data FROM attempts WHERE id=? AND owner=?")
      .get(id, owner) as { data: string } | undefined;
    if (!row) throw new Error("Attempt not found.");
    const a: Stored = JSON.parse(row.data);
    if (
      a.status === "active" &&
      a.deadline !== null &&
      this.now() >= a.deadline
    )
      this.finish(owner, a, "timeout");
    return a;
  }
  private all(owner: string) {
    return (
      this.db
        .prepare("SELECT id FROM attempts WHERE owner=? ORDER BY rowid DESC")
        .all(owner) as { id: string }[]
    ).map((row) => this.read(owner, row.id));
  }
  private present(a: Stored): Attempt {
    return {
      ...a,
      serverNow: this.now(),
      questions: a.questions.map((q) => {
        if (
          a.status === "submitted" ||
          (a.mode === "study" && a.responses[q.id]?.checked)
        )
          return q;
        const {
          correct: _c,
          explanation: _e,
          references: _r,
          sourceAnswer: _s,
          ...publicQuestion
        } = q;
        return publicQuestion;
      }),
    };
  }
  get(owner: string, id: string) {
    return this.present(this.read(owner, id));
  }
  create(
    owner: string,
    mode: "exam" | "study",
    count: number | "all",
    topics: number[],
    missedOnly: boolean,
  ) {
    if (mode === "exam" && count === "all")
      throw new Error("Timed exams require 57–60 questions.");
    if (
      mode === "exam" &&
      this.all(owner).some((a) => a.mode === "exam" && a.status === "active")
    )
      throw new Error(
        "An exam is already active. Resume or submit it before starting another.",
      );
    const seen = new Map<string, number>(),
      weak = new Set<string>();
    for (const a of this.all(owner))
      for (const q of a.questions) {
        const id = canonicalId(q);
        seen.set(id, (seen.get(id) ?? 0) + 1);
        if (a.status === "submitted" && !isCorrect(q, a.responses[q.id]))
          weak.add(id);
      }
    const questions = sampleQuestions(
      this.bank,
      count,
      seen,
      mode === "exam" ? [] : topics,
      missedOnly ? weak : undefined,
    );
    const createdAt = this.now();
    const a: Stored = {
      id: randomUUID(),
      mode,
      status: "active",
      createdAt,
      deadline: mode === "exam" ? createdAt + 3600000 : null,
      submittedAt: null,
      count: questions.length,
      passThreshold: 70,
      questions,
      responses: {},
      score: null,
      correctCount: null,
      passed: null,
      submissionReason: null,
    };
    this.save(owner, a);
    return this.present(a);
  }
  answer(
    owner: string,
    id: string,
    questionId: string,
    selected: string[],
    flagged: boolean,
  ) {
    const a = this.read(owner, id);
    if (a.status !== "active")
      throw new Error("This attempt has been submitted.");
    const q = a.questions.find((q) => q.id === questionId);
    if (!q) throw new Error("Question not found in this attempt.");
    if (
      new Set(selected).size !== selected.length ||
      selected.some((s) => !q.options.some((o) => o.id === s)) ||
      selected.length > (q.type === "multiple" ? q.correct.length : 1)
    )
      throw new Error("Invalid answer selection.");
    const previous = a.responses[q.id];
    if (
      previous?.checked &&
      JSON.stringify([...selected].sort()) !==
        JSON.stringify([...previous.selected].sort())
    )
      throw new Error("A checked study answer cannot be changed.");
    a.responses[q.id] = {
      selected,
      flagged,
      checked: previous?.checked ?? false,
    };
    this.save(owner, a);
    return this.present(a);
  }
  check(owner: string, id: string, questionId: string) {
    const a = this.read(owner, id);
    if (a.mode !== "study" || a.status !== "active")
      throw new Error(
        "Answer checking is available only during an active study session.",
      );
    if (!a.questions.some((q) => q.id === questionId))
      throw new Error("Question not found.");
    if (!a.responses[questionId]?.selected.length)
      throw new Error("Select an answer first.");
    a.responses[questionId].checked = true;
    this.save(owner, a);
    return this.present(a);
  }
  submit(owner: string, id: string) {
    return this.present(this.finish(owner, this.read(owner, id), "manual"));
  }
  dashboard(owner: string): Dashboard {
    const attempts = this.all(owner);
    const summary = ({
      questions: _q,
      responses: _r,
      passThreshold: _p,
      ...a
    }: Stored): AttemptSummary => a;
    const ready = this.bank.filter((q) => q.status === "ready");
    return {
      sourceUrl: /^https?:\/\//.test(process.env.SOURCE_URL ?? "")
        ? process.env.SOURCE_URL
        : undefined,
      total: this.bank.length,
      ready: ready.length,
      unique: new Set(ready.map(canonicalId)).size,
      review: this.bank.length - ready.length,
      markdown: this.bank.filter((q) => q.source.kind === "markdown").length,
      screenshots: this.bank.filter((q) => q.source.kind === "screenshot")
        .length,
      topics: TOPICS.map((name, index) => {
        const id = index + 1;
        const responses = attempts
          .filter((a) => a.status === "submitted")
          .flatMap((a) =>
            a.questions
              .filter((q) => q.topic === id)
              .map((q) => isCorrect(q, a.responses[q.id])),
          );
        return {
          id,
          name,
          total: this.bank.filter((q) => q.topic === id).length,
          ready: new Set(ready.filter((q) => q.topic === id).map(canonicalId))
            .size,
          accuracy: responses.length
            ? (responses.filter(Boolean).length / responses.length) * 100
            : null,
          answered: responses.length,
        };
      }),
      history: attempts.filter((a) => a.status === "submitted").map(summary),
      active: attempts.filter((a) => a.status === "active").map(summary),
    };
  }
  close() {
    this.db.close();
  }
}
