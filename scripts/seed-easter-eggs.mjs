// Local CLI only. Never expose profile identifiers through a public endpoint.
import { readFileSync } from "node:fs";
import { Store } from "../dist/server/store.js";
import { seedEasterEggDemo } from "../dist/server/demo.js";
const store = new Store();
try {
  let owners = process.env.PROFILE_ATTEMPT_ID
    ? store.db
        .prepare("SELECT owner FROM attempts WHERE id=?")
        .all(process.env.PROFILE_ATTEMPT_ID)
        .map((row) => row.owner)
    : store.db
        .prepare("SELECT DISTINCT owner FROM attempts")
        .all()
        .map((row) => row.owner);
  // After a reset, the previous export identifies the same browser without changing its cookie.
  if (
    !owners.length &&
    process.env.PROFILE_EXPORT &&
    !process.env.PROFILE_ATTEMPT_ID
  ) {
    owners = [
      ...new Set(
        JSON.parse(readFileSync(process.env.PROFILE_EXPORT, "utf8")).map(
          (row) => row.owner,
        ),
      ),
    ];
  }
  if (owners.length !== 1)
    throw new Error(
      "Expected one local profile. Select PROFILE_ATTEMPT_ID, or supply PROFILE_EXPORT for a reset profile. No data changed.",
    );
  if (process.argv.includes("--remove")) {
    const result = store.db
      .prepare(
        "DELETE FROM attempts WHERE owner=? AND json_extract(data,'$.demo')='pink-floyd-v1'",
      )
      .run(owners[0]);
    console.log(JSON.stringify({ removed: result.changes }));
  } else {
    const result = seedEasterEggDemo(store, owners[0]);
    console.log(
      JSON.stringify({
        ...result,
        history: store.dashboard(owners[0]).history.map((a) => ({
          id: a.id,
          mode: a.mode,
          score: a.score,
          demo: a.demo,
        })),
      }),
    );
  }
} finally {
  store.close();
}
