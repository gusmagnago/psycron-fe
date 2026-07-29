## Psycron FE — how to build with these components

These are the real, shippable UI primitives from the `psycron-fe` app (React 18 +
MUI v7 + Emotion/styled-components). Ten components ship on `window.PsycronFE`:
**Button, Card, Checkbox, Select, Slider, SwitchGroup, Tooltip, Avatar, Progress,
Pagination**. Build with these directly; don't reinvent them.

### Wrapping and setup — REQUIRED

Every component must render inside the psycron **MUI ThemeProvider** carrying the
psycron theme, or it falls back to default MUI styling (uppercase buttons, square
corners, wrong colors). The synced previews wrap in a `DSProviders` component that
supplies, in order: `BrowserRouter` → MUI `ThemeProvider(psycron theme)` →
`I18nextProvider`. In an app, mirror that:

```tsx
import { ThemeProvider } from '@mui/material';
import theme from '@psycron/theme';           // the psycron MUI theme
import { Button } from '@psycron/components/button/Button';

<ThemeProvider theme={theme}>
  <Button secondary onClick={...}>save</Button>
</ThemeProvider>
```

The theme is what gives buttons their pill shape (border-radius 40px), lowercase
text, and the brand palette. Without it components render un-themed.

### Styling idiom — prop-driven, NOT class names

There is **no utility-class system**. Style through component props and the theme,
never by adding CSS classes. Each primitive takes MUI props plus a few psycron
semantic props. Example — `Button` (`@psycron/components/button/Button`):

- `secondary?: boolean` — pink outline pill
- `tertiary?: boolean` — purple outline pill
- `severity?: 'error' | ...` — semantic color
- `loading?: boolean` — inline spinner
- `fullWidth?: boolean`
- `variant`, `onClick`, `children` (label text — kept lowercase by the theme)

Default (no flag) = the pale-blue contained "primary" pill. The other primitives
follow the same shape: MUI props for behavior, the theme for appearance.

### Where the truth lives

- Per-component API + usage: each `components/<group>/<Name>/<Name>.prompt.md`
  and `<Name>.d.ts` (bound alongside this README) — read these before composing.
- Component groups: `elements/` (Button, Checkbox, Select, Slider, SwitchGroup,
  Tooltip, Avatar, Progress) and `components/` (Card, Pagination).
- Styling ships at runtime (Emotion/styled-components CSS-in-JS + theme
  `styleOverrides`), so there is no static stylesheet to read — the theme object
  is the source of truth for color, radius, and typography.
