# design-sync notes — psycron-fe

Durable notes for future re-syncs. Read this before running the driver.

## Repo shape

- **psycron-fe is a full Vite APP, not a packaged component library.** There is no
  library `dist/` and no barrel export. `dist/` is the built web app.
- Because the storybook shape needs a bundle entry, we author one:
  **`.design-sync/entry.ts`** re-exports the components onto `window.PsycronFE`.
  Regenerate it with `scratchpad/gen-barrel.mjs` logic if the component set changes.
  Each component is exported under its used name AND aliased to its source-file
  basename, so the story-import redirect (rule 2 keys on file basename) shims
  reliably to the global.
- Runtime bundle resolves `@psycron/*` via `cfg.tsconfig = tsconfig.json`
  (baseUrl `.`, paths `@psycron/* -> ./src/*`). Without it the bundle can't
  resolve component internal imports.

## Scope — PRIMITIVES ONLY (user decision, 2026-07-10)

Synced set = the clean, standalone UI primitives (17 components + Icons gallery):
Button, Link, Avatar, Checkbox, Progress, CircularProgress, Radio (RadioButtonGroup),
Select, Slider, Switch (SwitchGroup), Tooltip, Card, Table, Pagination, TableBody,
TableHead, TableCell, Icons.

Everything else is excluded from the roster via `cfg.titleMap: {<title>: null}`
because those components depend on app context (router data, react-query, auth,
maps, 3D) and don't render standalone. Excluded: Introduction, Dashboard cards,
all Form components (AddPatient/SignIn/SignUp/Address/Contacts/Name/Password),
Navbar + Menu Item, Patients Card, Payments Card, User Details Card, Edit User,
App Layout. To widen scope later, remove the title from `titleMap` AND add its
export to `entry.ts`.

## Reference storybook build — trimmed config

The repo's real `.storybook/main.ts` breaks `storybook build` under Storybook 10:
`storybook-react-i18next` (via `storybook-i18n`) and `@chromatic-com/storybook`
manager bundles can't resolve `@storybook/manager-api` / `@storybook/components`,
and `@storybook/addon-docs` isn't installed. So we build the reference against a
trimmed config: **`.design-sync/sb-config/`** (main.ts with only addon-links +
addon-themes; preview.tsx copied with `../src` → `../../src` path fixes).
`cfg.storybookConfigDir` points here. The converter reads decorators from the
same trimmed preview.tsx. If the repo's storybook setup is fixed upstream, this
trimmed config can be retired and storybookConfigDir pointed back at `.storybook`.

Build the reference with:
`npx storybook build -c .design-sync/sb-config -o "$(git rev-parse --show-toplevel)/.design-sync/sb-reference"`

## [GENERAL] Bundle-native providers (cfg.provider) — REQUIRED

The storybook `preview.tsx` decorators are bundled SEPARATELY (preview-decorators.js)
with their own copies of MUI / react-router / react-i18next. Their React contexts
CANNOT cross into `_ds_bundle.js`, so decorator-provided theming rendered every
component UN-THEMED (default MUI: uppercase buttons, no pill radius, wrong colors).
Fix: `.design-sync/providers.tsx` exports `DSProviders` (BrowserRouter > MUI
ThemeProvider(psycron theme) > I18nextProvider), added to `cfg.extraEntries` so it
bundles INTO `_ds_bundle.js` (same instances as the components), and
`cfg.provider = {"component": "DSProviders"}`. Now the theme context reaches the
components. Verified: Button renders lowercase, border-radius 40px, pale-blue bg.
Do NOT remove this — without it the whole design system renders un-themed.

## [GENERAL] Excluded components (cross-bundle context / app coupling)

Some components can't render standalone and were excluded (titleMap null + dropped
from entry.ts):
- Link: `useNavigate()` needs a Router. DSProviders' BrowserRouter would fix it
  (same-bundle now) — re-add to entry.ts + remove titleMap null to try.
- RadioButton (RadioButtonGroup): react-hook-form `useFormContext()` returns null
  without a FormProvider carrying `methods` from useForm(). Would need DSProviders
  to include a FormProvider with a default form.
- Table / TableBody / TableHead / TableCell: TableCell calls `useAppointmentActions()`
  (AppointmentActionsProvider) — genuinely app-domain-coupled, not a portable primitive.
- CircularProgress: 3D WebGL loader.  Icons: namespace gallery (no single export).

## Provider chain

`.storybook/preview.tsx` decorators (auto-bundled by the converter) supply:
BrowserRouter > ThemeProvider(MUI theme) > CssBaseline > UserDetailsProvider >
UserGeoLocationProvider. i18n is applied via the `storybook-react-i18next` addon
(parameters.i18n), NOT a decorator — watch for untranslated previews; if strings
render as keys, distill an i18n provider into `cfg.provider`.

## Known upstream story bugs

- **SignUp story is broken in storybook itself**: `SignUp.stories.tsx` imports
  `{ SignUp }` from `./SignUpEmail`, but that file only exports `SignUpEmail`.
  It's excluded from scope anyway (form component).

## Re-sync risks

- `entry.ts` and `providers.tsx` are hand-maintained. If a primitive is
  added/renamed/moved, update the barrel AND `titleMap` together or the roster drifts.
- **Theming depends entirely on `DSProviders`** (cfg.provider). Any change to the
  psycron theme (`src/theme`) or a bump of MUI/react-router/react-i18next can
  regress previews — scoped-compare Button (or any themed primitive) after such a
  change. If everything renders un-themed again, the provider bundling broke.
- Previews use `cfg.provider`, NOT the storybook decorators (decorator bundling is
  skipped when cfg.provider is set). The reference storybook still uses
  `.design-sync/sb-config/preview.tsx` — keep that chain equivalent to DSProviders
  or grading drifts.
- Trimmed reference config (`.design-sync/sb-config/`) exists only because the
  repo's real `.storybook` build is broken (i18n/chromatic/docs addons, stale
  provider paths). If the repo's storybook is fixed upstream, this can be retired.
- Grading was exhaustive per story (small roster). Progress "In Progress" accepted
  as `close` (animation-fill frame difference, not a defect). Tooltip is inherently
  thin (hover-only content) — both sides show only the trigger icon.
- Excluded components (Link, RadioButton, Table family, CircularProgress, Icons) —
  see the "[GENERAL] Excluded components" section for why and how to try re-adding.

## Verified result (first sync, 2026-07-10)

10/10 primitives render faithfully vs the storybook reference. All stories graded
`match` except Progress "In Progress" (`close`). Excluded 25 of 35 storied
components as app-coupled / non-primitive per the primitives-only scope.
