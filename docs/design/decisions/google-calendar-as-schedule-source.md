# Decision record — Google Calendar as schedule source

- **Status:** 🟠 In progress (implementing locally; verify in UI before PR)
- **Decided by:** Gustavo, 2026-05-29
- **Repos:** psycron-be (`googleCalendarService.ts`, `controller/availability.ts`, enrich helper) + psycron-fe (week view, dashboard, API types, i18n)
- **Follows:** [`../coding-and-design-guidelines.md`](../coding-and-design-guidelines.md)

## Context

Therapists keep their real sessions in Google Calendar (e.g. "Client: William S. - Weekend session").
Live diagnostic on the test account: **348 events / next 90 days, 834 / year**, all timed + recurring,
first event 2026-05-30. Two real bugs + a design mismatch were found:

- Old sync capped at `maxResults: 250`, no pagination → ~100 events silently dropped.
- Sync window hardcoded to **+90 days** → Sept–Dec sessions never synced.
- Events were ingested as `BLOCKED` (busy) on top of garbage base availability → looked empty/broken.

## Decisions

1. **Calendar events = BOOKED sessions, not BLOCKED busy time.** Google is the source of truth for
   the schedule. Ingested slots get `status = BOOKED`, keep `googleEventId`, and store the event
   title (e.g. as `note`). They surface as the FE `booked-google` status (distinct from
   `booked-jupiter`).
2. **Sync the full event range, matched to the availability horizon** (not a fixed 90 days). Window
   = latest availability date (fallback +365d), fully paginated.
3. **Distinguish Google-sourced slots everywhere:** `googleEventId` is now included in the authed
   availability response; FE `toSlotStatus` maps `BOOKED + googleEventId → booked-google`. Month
   calendar `google` lane counts these; they are excluded from the `jupiter` lane.

## Sync architecture (locked 2026-05-29)

Built to serve **all** users from one model — slots are tagged by `source`, behavior gated by mode.

- **`source` on every slot:** `psycron` (in-app / Júpiter) or `google` (`googleEventId` set). Future
  providers slot in here. Sync only ever refreshes/removes `google` slots — `psycron` slots are
  never touched.
- **Modes (all supported by the same code):**
  - *Psycron-native* — no Google; only `psycron` slots; fully standalone (first-class, must always work).
  - *Google two-way* (Gustavo's choice) — events import as `booked-google`, **editable in Psycron**,
    and edits **write back to the connected calendar**. Create/edit/delete in Psycron → Google
    `events.insert/patch/delete`; Google changes flow in on sync.
- **Write-back target:** the **connected calendar** (Gustavo's choice). ⚠️ It's a **shared group
  calendar** (`…@group.calendar.google.com`) — writes are visible to all subscribers. Acceptable
  per decision; surface this in the connect UI.
- **Editable now:** imported sessions are editable; an edit must write back to Google so it is not
  lost on the next sync (i.e. write-back is required for editing to be safe — they ship together).
- **Conflicts:** reuse `conflictService`; Google is source of truth on inbound conflicts.

### OAuth scope — ✅ already covered
`CALENDAR_SCOPES` already requests `https://www.googleapis.com/auth/calendar.events` (read **+
write**). Write-back (Phase 2) needs **no re-consent / scope upgrade**.

### Phasing
- **Phase 1 (now):** import events as `booked-google`, full range, paginated, visible in week view +
  month "google" lane. `googleEventId` exposed in the API. Read path only.
- **Phase 2 (next):** write-back — edit/create/delete in Psycron → connected calendar; scope check
  + re-consent if needed; incremental sync (`syncToken`); conflict handling.

## Open questions / watch-outs

- **Dashboard/earnings:** `booked-google` sessions have no linked patient or payment. Must not
  inflate revenue or crash the schedule widget (no patient name). Verify in UI; treat as
  external/booked-elsewhere, not billable Psycron bookings.
- **Base availability** still needs regenerating (separate `8:51–9:52` import-garbage issue) so the
  booked sessions sit on a real schedule.
- Buffer slots around `booked-google` (FE already supports `bufferFor: 'booked-google'`).

## Next steps / resume point

1. ⏳ Implement BE (status, window, googleEventId in response, calendar lane) + FE (mapping, types,
   legend) locally.
2. Re-sync on dev local; verify week view shows sessions as `booked-google`, full range, no crash.
3. Verify dashboard isn't inflated/broken by patient-less booked slots.
4. Gustavo confirms in UI → then PR.

## Changelog

- 2026-05-29 — Created. Decision: events → booked sessions, sync full range.
