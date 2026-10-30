# Contributing

OpenPrep is a free community project. Read `LICENSE`,
`THIRD_PARTY_NOTICES.md`, and `questions/README.md` before contributing.

Use Node.js 24 or newer. Run `npm ci`, `npm run dev`, and open the printed local
Vite URL. Before submitting changes run:

```sh
npm run validate:questions
npm test
npm run build
```

For a question correction, include its stable ID, the current and proposed
answer, a concise explanation, and relevant Terraform 1.12 documentation. Keep
source attribution and original artifacts. Mark incomplete or ambiguous material
for review rather than inventing missing options or silently deleting it.

For new questions, contribute original material or provide explicit permission
and license information. Cover an official 004 objective. Include options,
selection count, answer, explanation, and references. Do not contribute restricted
exam content. Original contributions are offered under the project license;
third-party material must be identified separately.

Keep tests meaningful: grading boundaries, exact multiple-answer scoring,
deadline enforcement, persistence, source retention, and complete exam flows.
Never commit user databases, cookies, credentials, or personal contact details.

## Optional demo progress

For UI testing, first create a session in your browser. Copy its UUID from the
result or session URL, then load five demo exams and a perfect study session:

```sh
docker compose exec -e PROFILE_ATTEMPT_ID=ATTEMPT_UUID app node scripts/seed-easter-eggs.mjs
```

The seed is labeled Demo, is included in progress statistics, and does not
duplicate existing demo data. Remove only that profile's demo sessions with:

```sh
docker compose exec -e PROFILE_ATTEMPT_ID=DEMO_ATTEMPT_UUID app node scripts/seed-easter-eggs.mjs --remove
```
