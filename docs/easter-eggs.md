# Pink Floyd Easter eggs (spoilers)

1. **The Dark Side of Terraform:** click the homepage artwork five times. On a
   narrow screen, use the small triangle button on the artwork. Enter/Space also
   work. Click once more to restore the original artwork; navigation resets it.
2. **Wish You Were Here:** search the question library for `pink floyd`. Case and
   extra spaces are accepted. The panther and empty chair appear outside the
   scored bank. Use Back to questions to clear the search.
3. **Shine On:** open a completed 100% exam or study result. Both show a trophy
   instead of the panther. Click the golden score to replace the trophy and score
   with the compact Pink Floyd artwork; click the artwork to return. Passing
   scores below 100% show the panther in both modes.
4. **Another Brick in the Wall:** complete at least five timed exams. My progress
   displays the five-brick milestone; study sessions do not count toward it.

The Easter eggs use local SVG/CSS and owner-supplied images. There is no audio,
external request, or egg in an active timed question. Supplied artwork retains
its third-party status as recorded in `THIRD_PARTY_NOTICES.md`.

## Demo progress

The local database was seeded with a labeled demo set for the existing profile
and the separate browser preview profile. Each has five 60-question exams at
60%, 70%, 80%, 90%, and 100%, plus one 10-question study session at 100%. Attempts
use question snapshots from the existing bank and the normal grading function.
They are completed sessions with realistic dates/durations and a `demo` marker;
they are included in progress statistics. No new backup was created.

The seeder is idempotent per browser profile. It preserves real attempts, active
sessions, question data, and other profiles. To seed again locally after a build:

```sh
docker compose exec app node scripts/seed-easter-eggs.mjs
```

For multiple profiles, identify a profile using an attempt ID from that browser's
result URL (the UUID after `/attempt/`):

```sh
docker compose exec -e PROFILE_ATTEMPT_ID=ATTEMPT_UUID app node scripts/seed-easter-eggs.mjs
```

To remove only that profile's labeled demo attempts:

```sh
docker compose exec -e PROFILE_ATTEMPT_ID=DEMO_ATTEMPT_UUID app node scripts/seed-easter-eggs.mjs --remove
```

`PROFILE_EXPORT` can identify a reset profile from an existing attempt export.
Neither command creates a backup or changes the question bank. The CLI is not
exposed as a web endpoint.
