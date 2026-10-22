import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "../server/app.js";
import { Store } from "../server/store.js";
import { fixture } from "./helpers.js";
import type { Attempt } from "../shared/types.js";

test("HTTP exam flow, cookie isolation, validation, origin checks, and library access", async () => {
  const store = new Store(":memory:", fixture()),
    server = createApp(store).listen(0, "127.0.0.1");
  try {
    await once(server, "listening");
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const base = `http://127.0.0.1:${address.port}`;
    const first = await fetch(base + "/api/dashboard");
    assert.equal(first.status, 200);
    const cookie = first.headers.get("set-cookie")!.split(";")[0];
    assert.match(first.headers.get("set-cookie")!, /HttpOnly/i);
    const headers = { "Content-Type": "application/json", Cookie: cookie };
    const create = await fetch(base + "/api/attempts", {
      method: "POST",
      headers,
      body: JSON.stringify({ mode: "exam", count: 60 }),
    });
    assert.equal(create.status, 201);
    const a = (await create.json()) as Attempt;
    assert.equal(a.questions.length, 60);
    assert.ok(!("correct" in a.questions[0]));
    const q = a.questions[0];
    const save = await fetch(`${base}/api/attempts/${a.id}/answers/${q.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ selected: ["A"], flagged: true }),
    });
    assert.equal(save.status, 200);
    const reload = await fetch(`${base}/api/attempts/${a.id}`, { headers });
    assert.equal((await reload.json()).responses[q.id].flagged, true);
    assert.equal((await fetch(`${base}/api/attempts/${a.id}`)).status, 404);
    assert.equal(
      (
        await fetch(base + "/api/attempts", {
          method: "POST",
          headers,
          body: JSON.stringify({ mode: "exam", count: 1000 }),
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await fetch(base + "/api/attempts", {
          method: "POST",
          headers: { ...headers, Origin: "https://other.example" },
          body: "{}",
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await fetch(base + "/api/attempts", {
          method: "POST",
          headers,
          body: "{",
        })
      ).status,
      400,
    );
    const submit = await fetch(`${base}/api/attempts/${a.id}/submit`, {
      method: "POST",
      headers,
      body: "{}",
    });
    const result = (await submit.json()) as Attempt;
    assert.equal(result.status, "submitted");
    assert.ok("correct" in result.questions[0]);
    const dashboard = await (
      await fetch(base + "/api/dashboard", { headers })
    ).json();
    assert.equal(dashboard.history.length, 1);
    assert.equal(dashboard.active.length, 0);
    const library = await (
      await fetch(base + "/api/questions?topic=3&search=Question&page=1", {
        headers,
      })
    ).json();
    assert.ok(library.questions.every((q: { topic: number }) => q.topic === 3));
    assert.equal((await fetch(base + "/api/unknown")).status, 404);
    assert.equal(
      (
        await fetch(
          base + "/sources/Screenshot%202026-10-09%20at%2015.35.41.png",
        )
      ).status,
      404,
    );
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    store.close();
  }
});
