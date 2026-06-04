# Coding & design guidelines (psycron-fe)

Both code and agents follow these. They distil the repo's `CLAUDE.md` plus standing design
feedback so UI stays consistent. Keep this in sync with the theme — never hardcode what a token
already provides.

## Design tokens — the only source of color/spacing/elevation

Import from `@psycron/theme/*`. **Never** hardcode hex, px spacing, or shadows in components.

- **Palette** (`theme/palette/palette.theme.ts`): brand anchor `palette.brand.purple = #683fff`
  (dark `#4a2db8`, light `#f0ebff`), `brand.google = #3B82F6`. Severity: `success #00C777`,
  `error #FF5450`, `alert/warning #FBE442` (light `#FFF8C8`), `info #9C79FD`. Neutrals: `gray['00'..'09']`,
  `dark`. Surfaces: `background.default #f7fafa`, `background.paper #F1F7FB`, `white`.
  - ⚠️ `*.surface.*` values are often **rgba strings**, not hex. Do **not** pass them to
    `hexToRgba()` — it throws "Invalid hex color". Use a hex token (e.g. `palette.warning.light`)
    when you need `hexToRgba`. (Root cause of the week-view crash, May 2026.)
- **Spacing** (`theme/spacing/spacing.theme.tsx`, 4px base): `xxs 4, xs 8, extraSmall 12,
  small 16, mediumSmall 20, medium 24, mediumLarge 28, large 32, …`. No `xsmall` key exists.
- **Shadow** (`theme/shadow/shadow.theme.tsx`): cards use `shadowDashboardTile` or `shadowSmall`
  (elevation, **no borders**). Reserve colored borders for feedback banners only.
- **Type**: Inter. Headings 600–700, body 400–500.

## Styling rules

- Styles live in `ComponentName.styles.tsx` using `@emotion/styled` (never `@mui/material` styled).
- No `sx`, `style`, or `className` props inside `.tsx`.
- Use `shouldForwardProp` for custom props on styled components.
- Responsive via `isBiggerThanMediumMedia` / `isBiggerThanTabletMedia` from `@psycron/theme/media-queries`,
  or `useViewport()`.

## Design conventions (standing feedback)

- **Icons: Lucide only.** No emojis as UI icons. For Júpiter, use the real cat icon
  `@psycron/components/icons/brand/Jupiter` — never sparkles or a generic AI glyph.
- **Text is left-aligned** by default.
- **Atomic design**: compose from existing `@psycron/components/*` (Button, Select, Drawer,
  Text, icons) before inventing markup. Drawer actions pin to the footer.
- **Always render a fallback.** Never `return null` while loading — show a skeleton matching the
  real layout (blank screens read as "broken").
- **Preview before code**: generate `/tmp/psycron-<feature>-preview.html` using these real tokens,
  get sign-off, then implement. Reference the approved preview from the decision record.

## Data/state patterns

- Server state via React Query; mutations follow the `onSuccess → showAlert + invalidateQueries`
  pattern. After a write that changes availability, invalidate `therapistAvailability`,
  `availabilityByDay`, and the Júpiter config query.
- Route through `apiClient` — never raw relative `fetch` (hits the Vercel host, no auth → silent 404).

## Backend coding style (psycron-be, for cross-repo work)

- ESM, single quotes, tabs, semicolons, alphabetised imports.
- One shared util per concern — don't fork divergent copies (e.g. time parsing lives in
  `src/utils/timeParsing.ts`; both the Júpiter publisher and date-override import it).
- `npm run lint` + `tsc --noEmit` clean before pushing; functional tests for new flows.
