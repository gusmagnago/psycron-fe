# Decision record — Availability Settings revamp

- **Status:** 🟡 Preview built — awaiting Gustavo's sign-off (do not implement yet)
- **Owner:** Gustavo (CEO/CTO) signs off; agent implements after UI approval
- **Preview:** `/tmp/psycron-availability-settings-preview.html` (regenerate from this record if cleared)
- **Page:** `src/pages/availability/availability-settings/`
- **Follows:** [`../coding-and-design-guidelines.md`](../coding-and-design-guidelines.md)

## Problem

The settings page felt unfinished: blank screen while loading (`if (isLoading) return null`),
awkward sync copy, and Google data that never visibly landed. Prior work (PR-361) was polish, not
the agreed revamp. This record is the agreed direction so it doesn't get re-litigated.

## Decisions

1. **Three states, always a fallback.** Loaded / Loading (skeleton matching layout) / empty. Never blank.
2. **Card system.** White cards on `shadowDashboardTile`, no borders, `--radius 16px`. Colored
   borders only on feedback banners. Section icon in a tinted 40px rounded tile.
3. **Setup-progress card** at top: progress ring (`x/5`), "N left" todo badge (`alert` tint),
   checklist rows with done/todo state and per-row action (Edit / Add / Manage).
4. **Google Calendar = explicit state machine:** Disconnected · Synced · Syncing · Stale (>6h) ·
   Sync error. Each state has its own banner color + primary action. Footer: last-synced + Sync now.
5. **Working hours = summary card** with day chips (active in purple) + key/values (hours, session
   length, repeats), Edit opens the drawer.
6. **Júpiter help card** uses the real **cat** icon (`@psycron/components/icons/brand/Jupiter`),
   gated CTA to re-run/re-import. Placeholder emoji in the preview is NOT shippable.
7. **Copy fixes** (the flagged ones):
   - `google-calendar-last-synced`: "Last synced just now" (<60s), else "Last synced 5 minutes ago".
     Drop `numeric:'auto'` → use "just now" + numeric:'always'. Removes the odd "this minute".
   - Remove `google-calendar-sync-hint` ("Refresh to pull your latest busy times") — the button is clear.
8. **Buttons:** primary = `brand.purple`; tertiary = `brand.light`/purple; disconnect = `error` ghost.

## Open questions (decide before/while building)

- **Month-calendar "google" lane** mapping is currently pragmatic (busy/total occupancy). Final
  semantics? (busy-only vs occupancy ratio.) — tie to BE `buildCalendar`.
- **Per-day vs single working window** on import (today: one global min→max window for all days).

## Implementation scope (when approved)

- `AvailabilitySettings.tsx`: replace `return null` with `<SettingsSkeleton/>`; restructure into the
  cards above using existing `@psycron/components/*`.
- New styled pieces in `*.styles.tsx` only (tokens, no inline styles).
- i18n: update the two copy keys (en + pt); add any new labels (en + pt).
- Use the existing `useAvailabilitySettings` hook state (`isLoading`, `isSyncing`, `lastSyncAt`, etc.).

## Next steps / resume point

1. ⏳ **Gustavo reviews `/tmp/psycron-availability-settings-preview.html`** → approve or adjust.
2. On approval: implement skeleton first (closes the "no fallback" gap), then cards top-down.
3. Apply the two copy changes. 4. Verify in local UI before any PR (no PR before UI sign-off).

## Changelog

- 2026-05-29 — Record created; preview built from real tokens. Status: awaiting sign-off.
