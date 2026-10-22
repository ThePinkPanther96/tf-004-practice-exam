# Initial local verification

Verified on 21 October 2026.

- `npm test`: all 12 tests passed, covering scoring boundaries for 57–60
  questions, exact multiple-answer scoring, objective sampling, linked duplicate
  avoidance, topic/missed filters, source retention, answer validation, HTTP
  origin checks, browser isolation, deadline enforcement, and SQLite persistence.
- `npm run build`: TypeScript checks and client/server production builds passed.
- `npm run validate:questions`: 245 entries, 228 ready entries, 212 unique ready
  groups, 17 review entries, and all 64 original screenshots retained.
- `docker compose up --build -d`: image built; non-root app is healthy with a
  read-only root filesystem and a persistent SQLite volume. Only
  `127.0.0.1:8080` is exposed.
- Browser: selected and checked a three-answer study question, reloaded it,
  verified the checked answer remained locked, and submitted the session.
- Browser: created a 57-question exam, saved an answer and flag, restarted the
  container, and confirmed both survived while the original clock continued.
- Browser: shortened that isolated QA attempt’s deadline and observed automatic
  submission with the timeout reason and original saved answer preserved.
- Browser: checked desktop layout, a 390px mobile exam view, navigation drawer,
  question library review filters, and source issue labels. No browser console
  warnings/errors were reported. The mobile view had no horizontal overflow.
- Removed only the two agent-created browser QA attempts after verification.
  The question bank and other records were untouched. The app remains running.

The custom community license is an initial draft pending legal review before
public release. Content readiness reflects the supplied Markdown technical audit,
structural validation, and initial screenshot review; it is not a claim of
independent technical verification of every question. Known issues remain visible
in `questions/import-report.json` and the question library.

## Readability update

- Increased answer text to 18px and supporting interface text to generally
  14–16px, with larger selection indicators and icons.
- Added local Shiki highlighting using VS Code Dark+ and HCL, shell, and JSON
  grammars. Code is rendered as React text tokens, preserving the source rather
  than inserting raw HTML. Long code lines scroll within their box.
- Expanded library questions show the complete code block.
- All 14 automated tests passed, including two new highlighting checks for
  source preservation, theme colors, aliases, and unknown-language fallback.
- Production builds split syntax highlighting into a separate cached bundle.

## Slate/violet palette and dark mode

- Shared semantic color tokens now cover navigation, forms, dialogs, selections,
  feedback, charts, and status labels in both themes. Green is reserved for
  correct/passed results; violet marks selections, blue marks study/links, amber
  marks warnings, and red marks incorrect/error states.
- The first render follows the OS preference unless a light/dark choice was
  saved. The header toggle persists the choice across refreshes and tabs.
- All 17 automated tests passed, including pre-paint preference initialization,
  restricted-storage fallback, and 4.5:1 minimum contrast for key text pairs in
  both themes. All 47 referenced color tokens have definitions.
- Browser checks covered light/dark switching, refresh persistence, the mobile
  navigation, violet answer selection, amber flagging, correct/incorrect
  feedback, and a dark submission dialog. The 319px view had no page overflow.
- VS Code Dark+ code colors were preserved. No browser errors were reported.
- Removed only the agent-created theme QA attempt. Docker remains healthy and
  running, with the existing question bank and other attempts unchanged.

## My progress accent

- Teal/cyan now identifies My progress in the navigation, score chart, objective
  indicators, and progress page accents. Exam and study icons keep their violet
  and blue colors.
- Production build and all three theme tests passed, including contrast checks
  for teal text in both themes and the active navigation link.
- Browser checks confirmed light/dark colors and no horizontal overflow at
  319px. Preview: `docs/progress-color.png`.

## Green practice exam accent

- Kept the general purple theme and gave Practice exam a green identity in its
  navigation, overview card, session history icon, setup badge and ticket, and
  exam action buttons. Study remains blue and progress remains teal.
- Answer selections retain the general purple theme; grading still uses
  correct/incorrect labels and icons alongside green/red feedback.
- Production build and the three theme tests passed. Contrast checks cover exam
  text, buttons, and active navigation in light and dark mode.

## Mascot placements

- Added the four owner-supplied Pink Panther poses: homepage welcome, exam
  settings, passed-exam celebration, and empty progress. Timed questions have no
  mascot. Artwork is served locally and its source filenames are recorded in
  `THIRD_PARTY_NOTICES.md`, separately from the application license.
- Production build passed. Browser checks verified all four placements, image
  loading, light/dark appearance, and no horizontal overflow at 319px.
- Passed-exam rendering was checked with a separate in-memory preview server;
  no test attempts were added to the app's saved progress. The preview was
  stopped after verification.
- Screenshots: `docs/mascot-setup.png`, `docs/mascot-passed-preview.png`, and
  `docs/mascot-home.png`.

## Homepage hero restored

- Restored the original orbit/tile hero artwork and its responsive layout.
  Moved the standing mascot beside the study tip in Recent practice, where it
  appears with or without session history. Other mascot placements are unchanged.
- Production build passed; browser verification confirmed the four hero tiles,
  relocated mascot, and no horizontal overflow at 319px. Docker is healthy.
- Current previews: `docs/hero-restored.png` and `docs/mascot-relocated.png`.

## Homepage mascot footer polish

- Combined the mascot and study tip into one compact surface, removed the
  separate inner box/icon, and anchored the footer to the bottom of Recent
  practice. Reduced the mascot size and shortened the tip for mobile readability.
- Production build passed. Browser checks confirmed both themes, loaded artwork,
  image/text containment, and no horizontal overflow at 319px.
- Current preview: `docs/mascot-footer-polished.png`.

## Exam setup spacing

- Changed exam settings to a compact inline group, keeping the panther beside
  the question selector rather than at the far edge of the panel. Reduced the
  desktop mascot to 72 × 99px and made the selector fill its field.
- Production build passed; browser checks confirmed the compact group, 12px
  mobile gap, loaded artwork, and no horizontal overflow at 319px.
- Current preview: `docs/mascot-setup-compact.png`.

## Passing and perfect-score themes

- Completed exam and study results use green for passing scores below 100% and
  gold for exactly 100%. Banners, their action buttons, history scores/icons, and
  exam score charts share the same result classification. Perfect scores have
  an explicit text label. Study completion wording is retained for other scores.
- Production build and all three theme tests passed, including gold foreground,
  background, and button contrast checks in both themes.
- Isolated in-memory previews verified exam 80%/100%, study 70%/100%, and the
  existing colors below 70%, with matching history and chart colors. No saved
  attempts were changed. The preview server was stopped after verification.
- Current preview: `docs/perfect-score-gold-preview.png`.

## Footer separation and sidebar icons

- Added a minimum 20px gap between populated recent history and the mascot box.
  Sidebar navigation and About icons now use a consistent neutral color while
  retaining active-page backgrounds and markers.
- Production build passed. An isolated populated-history preview confirmed the
  20px gap, matching colors on all five navigation icons, and no horizontal
  overflow at 319px. Saved attempts were unchanged and the preview was stopped.
- Current previews: `docs/mascot-footer-spacing-preview.png` and
  `docs/sidebar-neutral-icons.png`.

## Study navigation active state

- Study mode now uses a blue active background, text, and marker in the sidebar.
  All navigation icons retain the same neutral color.
- Production build and all three theme checks passed, including active-state
  contrast in both themes. Browser verification confirmed the blue selection
  and consistent icon colors. Preview: `docs/study-sidebar-blue.png`.

## Two additional mascot poses

- Added a relaxed pose beside Study mode's question selector, sharing the compact
  settings layout with exams. Added a presenting pose to empty library searches.
  Both assets came from the owner's supplied images; original filenames are
  recorded in `THIRD_PARTY_NOTICES.md`.
- Production build passed. Browser checks confirmed both images loaded, the
  empty-search condition, light/dark appearance, and no overflow at 319px.
  The preview search was cleared afterward; no practice attempts were created.
- Previews: `docs/mascot-study-guide.png` and `docs/mascot-library-guide.png`.

## Pink Floyd Easter eggs and demo progress

- Added the five-click homepage prism, `pink floyd` library search with panther
  and chair, clickable perfect-score diamond/message, and five-exam brick
  milestone in My progress. All are outside active timed questions, use local
  assets, and support normal button keyboard interaction.
- Added a profile-scoped, idempotent CLI seed with explicit Demo labels. Seeded
  five exams (60/70/80/90/100%) and one perfect study session for the existing
  local profile and the separate browser preview profile. Removed only the
  temporary unanswered profile-registration session. No new backup was made.
- All 20 automated tests passed, including the five-exam threshold, exact secret
  search normalization, normal grading of demo results, idempotence, and profile
  isolation. Production builds passed.
- Browser verification covered the prism trigger, search reveal, perfect exam
  diamond, and five-brick milestone with the seeded production data. The
  temporary in-memory preview server was stopped.
- Triggers and demo removal: `docs/easter-eggs.md`. Screenshots:
  `docs/easter-egg-prism.png`, `docs/easter-egg-wish.png`,
  `docs/easter-egg-shine.png`, and `docs/easter-egg-bricks.png`.

## Perfect score artwork toggle

- Replaced the diamond with the owner-supplied Pink Floyd image. Clicking 100%
  now replaces the score with a larger artwork card; clicking the card restores
  the score. A light image surface keeps the black artwork visible in dark mode.
- Production build passed. Browser checks confirmed image loading, removal of
  the visible score during reveal, restoration on the next click, and no page
  overflow in either theme. Saved progress was unchanged.
- Current preview: `docs/easter-egg-shine-artwork.png`.

## Sidebar and header polish

- Moved About this project into the main navigation with an active-page state.
  Reduced the sidebar version label to 12px and tightened footer spacing so it
  remains visible at a 720px viewport height.
- Leaf icons now sit beside the community heading, setup/review tips, and About
  heading. Theme switch and EXAM 004 badge both measure 136 × 40px on desktop,
  with matching 14px text; the mobile theme switch retains its compact layout.
- Production builds passed. Browser checks confirmed equal control dimensions,
  exactly one About link, visible footer version text, side-by-side leaf layouts,
  and no horizontal overflow. Both themes were checked; saved data was unchanged.
- Current preview: `docs/sidebar-header-polish.png`.

## Consistent result celebrations

- The community label stays on one line without overflowing its sidebar space.
  Both exam and study passing results below 100% show the panther. Perfect
  results show a trophy beside the score instead; revealing the Easter egg
  replaces both with compact artwork. Clicking it restores the trophy and score.
- Reduced artwork from 186px to 112px high and the card from 190px to 148px wide,
  with a shorter return hint. Production builds passed.
- Browser checks confirmed the study 70% panther, study/exam 100% trophies,
  absence of either character during reveal, return behavior, one-line sidebar
  text fitting its space, and no overflow. An isolated in-memory preview was
  stopped after testing; saved demo and real results were unchanged.
- Previews: `docs/result-trophy-polished.png` and
  `docs/result-easter-egg-compact.png`.
