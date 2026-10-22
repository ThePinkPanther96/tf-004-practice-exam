# TerraPrep Community

A free, local-first practice app for **Terraform Associate 004**. Built with
React, TypeScript, Express, and SQLite. One Docker container; no Redis, cloud
account, AI service, or API key required.

![TerraPrep dashboard](docs/overview.png)

## Run with Docker

Start Docker Desktop, then run:

```sh
docker compose up --build -d
```

Open **http://localhost:8080**. The default port is bound only to your computer’s
loopback interface. SQLite lives in the persistent `terraprep-data` Docker volume.
`docker compose down` stops the app without deleting your progress. Avoid
`docker compose down -v` unless you intend to erase the database.

## Features

- Timed exams: 57–60 questions, 60 minutes, 70% passing target.
- True/false, single-answer, and exact-set multiple-answer scoring.
- Question navigation, flagging, answer autosave, and submission summary.
- Server-enforced deadlines; the clock continues through refreshes and restarts.
- Untimed study sessions with topic filters, missed-question practice, and
  immediate answer checks.
- Detailed review, explanations, source links, objective breakdowns, and history.
- Searchable collection of **245 entries**: 139 Markdown questions and 106
  screenshot entries, preserving all 64 original images.
- Linked duplicates, documented corrections, and visible review status for
  incomplete or ambiguous sources. No collected entry is silently removed.
- Anonymous browser-specific histories; no login or analytics.
- Responsive layout for desktop and mobile.
- Slate/violet light and dark themes. The header switch remembers your choice;
  the first visit follows your system preference. VS Code Dark+ code colors stay
  consistent in both modes.

The 57–60 question count and 70% threshold are simulator settings. The official
exam page confirms a one-hour exam based on Terraform 1.12, but does not specify
those two figures. This tool is independent of HashiCorp and does not claim to
contain authenticated exam questions or guarantee a passing result.

## Develop locally

Requires Node.js 24+ (uses built-in `node:sqlite`) and npm.

```sh
npm ci
npm run dev
```

Open **http://localhost:5173**. The API runs at `127.0.0.1:3001`; Vite proxies API
requests. Local development data is stored in ignored `data/terraprep.sqlite`.

```sh
npm run validate:questions
npm test
npm run build
npm start
```

The production server defaults to **http://127.0.0.1:3001** outside Docker.
Use `DB_PATH`, `PORT`, and `HOST` to override these defaults. Do not run two app
instances against the same database file.

## Data and scoring

Curated content is tracked in `questions/bank.json`. The importer and original
materials are in `scripts/` and `questions/sources/`. See `questions/README.md`
for updates, transcription details, and provenance.

SQLite stores question records and full per-attempt snapshots. Later bank
corrections do not change historical results. Removing an entry from a future
import does not delete its database record. A timed exam samples unique linked
questions across available objective areas, favoring less-seen questions. The
objective distribution is a practice policy, not a claimed official weighting.

Each question earns one point only for the exact correct set. Unanswered
questions are incorrect. Pass/fail uses the unrounded score, so 42/60 passes and
41/60 fails. Closing the app does not pause an exam. Expired attempts are finalized
on their next request and cannot accept late answers; a background browser timer
also submits at the deadline. No always-running worker is required.

Your browser’s anonymous HttpOnly cookie links to your server-side history.
Clearing it or switching browsers starts a different history. There is no account
recovery in this initial version. Back up the Docker volume to retain the database;
for a consistent file backup, stop the app first or use SQLite’s backup tooling.

## Hosting a free community instance

The same image can be hosted on a server. Access must remain free under the
project license, and publicly hosted modifications must provide corresponding
source. Set `SOURCE_URL` to the matching source repository/version; the app shows
this link in its footer. Configure an HTTPS reverse proxy to the app. Keep its port private to
the proxy where possible; alternatively set `BIND_ADDRESS=0.0.0.0` with appropriate
host firewall rules. Set `COOKIE_SECURE=true` for HTTPS and `TRUST_PROXY=1` only
when exactly one trusted proxy controls forwarded headers. `.env.example` shows
the supported Docker settings.

The initial app is a single-instance deployment with anonymous browser histories.
Public operators should provision storage, backups, and request limits at their
proxy. No cloud-specific infrastructure is bundled.

## Community license

Original project work uses the **TerraPrep Community License v0.1**, a custom
noncommercial, source-sharing license in `LICENSE`. It allows free local use,
modification, redistribution, and free web hosting. Paid access, commercial
redistribution, and closed-source derivatives are prohibited. This is
source-available software, not an OSI-approved open-source license. The initial
license text is a draft pending legal review before public release.

Third-party content keeps its applicable licenses and permissions; the project
license does not replace them. See `THIRD_PARTY_NOTICES.md`. The project owner
reports receiving permission from screenshot creators. Public-release attribution
details can be completed without publishing private correspondence.

Easter egg triggers and optional labeled demo progress are documented in
[the Easter egg testing guide](docs/easter-eggs.md).
