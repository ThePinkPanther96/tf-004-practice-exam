import express from "express";
import { randomBytes } from "node:crypto";
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import type { Store } from "./store.js";
import { TOPICS } from "../shared/types.js";

export function createApp(store: Store) {
  const app = express();
  if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "same-origin");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    );
    next();
  });
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET" && req.method !== "HEAD") {
      const origin = req.get("origin");
      if (
        req.get("sec-fetch-site") === "cross-site" ||
        (origin && origin !== `${req.protocol}://${req.get("host")}`)
      ) {
        res.status(403).json({ error: "Requests must come from this app." });
        return;
      }
      if (!req.is("application/json")) {
        res.status(415).json({ error: "JSON required." });
        return;
      }
    }
    const cookie = req.headers.cookie?.match(
      /(?:^|;\s*)terraprep=([a-f0-9]{64})(?:;|$)/,
    )?.[1];
    res.locals.owner = cookie ?? randomBytes(32).toString("hex");
    if (!cookie)
      res.cookie("terraprep", res.locals.owner, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.COOKIE_SECURE === "true",
        maxAge: 365 * 86400000,
        path: "/",
      });
    next();
  });
  app.use(express.json({ limit: "32kb" }));
  app.get("/api/dashboard", (_req, res) =>
    res.json(store.dashboard(res.locals.owner)),
  );
  app.get("/api/questions", (req, res) => {
    const search = String(req.query.search ?? "")
      .slice(0, 200)
      .toLowerCase();
    const topic = Number(req.query.topic ?? 0),
      status = String(req.query.status ?? "all");
    const filtered = store.bank.filter(
      (q) =>
        (!topic || q.topic === topic) &&
        (status === "all" || q.status === status) &&
        `${q.prompt} ${q.id} ${q.source.number} ${q.options.map((o) => o.text).join(" ")}`
          .toLowerCase()
          .includes(search),
    );
    const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
    res.json({
      total: filtered.length,
      page,
      pages: Math.max(1, Math.ceil(filtered.length / 20)),
      topics: TOPICS,
      questions: filtered.slice((page - 1) * 20, page * 20),
    });
  });
  app.post("/api/attempts", (req, res) => {
    const { mode, count, topics = [], missedOnly = false } = req.body ?? {};
    if (
      !["exam", "study"].includes(mode) ||
      !Number.isInteger(count) ||
      (mode === "exam" ? count < 57 || count > 60 : count < 1 || count > 100) ||
      !Array.isArray(topics) ||
      topics.some(
        (t: unknown) => !Number.isInteger(t) || Number(t) < 1 || Number(t) > 8,
      ) ||
      typeof missedOnly !== "boolean" ||
      (mode === "exam" && missedOnly)
    ) {
      res.status(400).json({ error: "Invalid exam settings." });
      return;
    }
    res
      .status(201)
      .json(store.create(res.locals.owner, mode, count, topics, missedOnly));
  });
  app.get("/api/attempts/:id", (req, res) =>
    res.json(store.get(res.locals.owner, req.params.id)),
  );
  app.put("/api/attempts/:id/answers/:questionId", (req, res) => {
    const { selected, flagged } = req.body ?? {};
    if (
      !Array.isArray(selected) ||
      selected.some((v) => typeof v !== "string") ||
      typeof flagged !== "boolean"
    ) {
      res.status(400).json({ error: "Invalid answer." });
      return;
    }
    res.json(
      store.answer(
        res.locals.owner,
        req.params.id,
        req.params.questionId,
        selected,
        flagged,
      ),
    );
  });
  app.post("/api/attempts/:id/check/:questionId", (req, res) =>
    res.json(
      store.check(res.locals.owner, req.params.id, req.params.questionId),
    ),
  );
  app.post("/api/attempts/:id/submit", (req, res) =>
    res.json(store.submit(res.locals.owner, req.params.id)),
  );
  app.use(
    "/sources",
    express.static(resolve("questions/sources/screenshots"), {
      dotfiles: "deny",
      index: false,
    }),
  );
  if (existsSync(resolve("dist/client/index.html"))) {
    app.use(express.static(resolve("dist/client")));
    app.get("/{*path}", (req, res) => {
      if (req.path.startsWith("/api/"))
        res.status(404).json({ error: "Not found." });
      else res.sendFile(resolve("dist/client/index.html"));
    });
  }
  app.use(
    (
      err: Error & { status?: number },
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (err.status === 400 || err.status === 413) {
        res.status(err.status).json({
          error: err.status === 413 ? "Request too large." : "Invalid JSON.",
        });
        return;
      }
      const notFound = /not found/i.test(err.message);
      const badInput =
        /Invalid|Only |already active|submitted|cannot|checking|Select|Question/.test(
          err.message,
        );
      if (!notFound && !badInput) console.error(err);
      res.status(notFound ? 404 : badInput ? 400 : 500).json({
        error:
          notFound || badInput
            ? err.message
            : "Unable to complete the request.",
      });
    },
  );
  return app;
}
