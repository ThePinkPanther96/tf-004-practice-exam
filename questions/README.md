# Question bank

Current collection: **245 community question entries**: 139 in the updated
Markdown and 106 text transcriptions. All question entries are retained,
including duplicates and questions that need corrections. The original 64
question screenshots have been removed; `bank.json` is the runtime representation.

## Rebuilding

With Python 3, run `npm run import:questions`. To import an updated source:

```sh
python3 scripts/import_questions.py --markdown /absolute/path/to/updated.md
npm run validate:questions
```

Also replace the bundled source Markdown with the updated file before release so
the source artifact and runtime bank stay aligned. Community question
transcriptions live in `scripts/import_questions.py`; extracted source text is
retained in `sources/community-question-transcriptions.json`. Rebuilding does
not require image files, OCR, or network access.

Stable IDs are `md-q001`, `shot-a-01`, etc. Answer IDs refer to the stored option
IDs, not display positions. Option order is preserved because some source options
depend on “above” wording. Each record includes source, topic, references,
readiness, and notes. Legacy `screenshot` source kinds and filenames record
provenance only; they do not refer to bundled files or image links.
`selectCount` tells the exam UI how many answers to choose.

`ready` means eligible for scored practice after import checks. Markdown answers
use the technical audit already present in the source document; other community
records use readable transcriptions and some concise paraphrases, with normalized
punctuation or code layout.
It is not a claim of independent verification of every technical detail. Obvious
source errors are corrected with explanations; altered keys retain `sourceAnswer`.
`needs-review` entries remain in the searchable library but
do not produce misleading exam scores. Review notes explain each exclusion.

`duplicateOf` links equivalent source entries without removing either one. Exact
normalized stems and explicitly identified equivalents are linked conservatively;
different questions testing the same concept may both occur in an exam. Sampling
uses one entry per linked group. `import-report.json` records counts, duplicates,
and review issues.

## Baseline retention and licensing

All 218 originally collected entries plus the 27 newly added Markdown entries
are part of the baseline collection. Maintained releases retain those source
records; corrections and additions are welcome. Tests guard against accidental
loss of the baseline. Review status does not delete an entry.

The application license covers original project work. Third-party question text
retains its original terms and reported creator permissions. See
`THIRD_PARTY_NOTICES.md`. Contributions must identify their source, permission,
answer reasoning, and relevant official documentation. Do not contribute
confidential exam material or claim questions are authenticated real-exam items.
