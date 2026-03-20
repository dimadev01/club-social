# Font Implementation Design

**Date:** 2026-03-20
**Status:** Approved

## Overview

Implement a custom font pairing for Club Social Monte Grande's admin web application. The goal is to give the UI a warmer, community-appropriate feel while maintaining legibility across data-dense screens (tables, forms, stats).

## Font Pairing

| Role | Font | Rationale |
|------|------|-----------|
| Body / UI | Nunito Sans | Neutral, highly legible at small sizes; ideal for tables, forms, menus |
| Headings | Nunito | Rounded terminals convey friendliness; harmonious with Nunito Sans |

Both fonts are from the same type designer, ensuring visual harmony. Both support Spanish characters fully. Weights loaded: 400, 600, 700.

## Loading Strategy

**Google Fonts via CSS `@import` in `index.css`.**

- No changes to `index.html`
- No additional npm dependencies
- The Google Fonts `@import` must be placed after the `@layer` declaration and before the antd `@import` (CSS requires `@import` rules to appear before all other rules except `@charset`, `@layer`, and `@namespace`)

## Implementation

### 1. `apps/web/src/index.css`

The current file begins:

```css
@layer theme, base, antd, components, utilities;

@import url('antd/dist/antd.css') layer(antd);

@import 'tailwindcss';
```

**Step 1 — Add Google Fonts import** between the `@layer` declaration and the antd import:

```css
@layer theme, base, antd, components, utilities;

@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap');
@import url('antd/dist/antd.css') layer(antd);

@import 'tailwindcss';
```

**Step 2 — Add `@theme` block** after `@import 'tailwindcss'` to register font variables for Tailwind utility classes:

```css
@theme {
  --font-sans: 'Nunito Sans', sans-serif;
  --font-heading: 'Nunito', sans-serif;
}
```

**Step 3 — Add `@layer base` rule** for plain HTML heading elements (not Ant Design components — see note below):

```css
@layer base {
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}
```

> **Note on layer specificity:** The existing layer order is `theme, base, antd, components, utilities`. Because `antd` has higher priority than `base`, Ant Design's `Typography.Title` (which renders via CSS-in-JS into the `antd` layer) is **not** affected by the `@layer base` rule. `Typography.Title` headings are covered exclusively by the `fontFamily` token in `AntProvider.tsx` (see below). The `@layer base` rule applies only to plain `h1–h6` HTML elements outside of Ant Design components.

### 2. `apps/web/src/app/AntProvider.tsx`

Add `fontFamily` to the existing `THEME_TOKEN` constant so all Ant Design components (including `Typography.Title`) inherit Nunito Sans as the base font, with Nunito applied to headings via the token:

```typescript
const THEME_TOKEN: ThemeConfig['token'] = {
  borderRadius: 8,
  colorInfo: PRIMARY_GREEN,
  colorPrimary: PRIMARY_GREEN,
  fontFamily: "'Nunito Sans', sans-serif",
};
```

> **Note:** Ant Design v5+ does not provide a separate heading font token. `Typography.Title` inherits `fontFamily` from the theme token but does not support a distinct heading font through the token API. Applying Nunito to `Typography.Title` headings requires a CSS override. Since `antd` has higher layer priority than `base`, the override must target the `antd` layer or use `@layer components`. This is addressed in Step 3 of the CSS changes above — if needed in a future iteration, moving the heading rule to `@layer components` would override antd styles. For now, `Typography.Title` will render in Nunito Sans (via the token), and plain HTML headings will render in Nunito (via `@layer base`).

## Scope

| File | Change |
|------|--------|
| `apps/web/src/index.css` | Add Google Fonts `@import` (after `@layer`, before antd import), `@theme` font variables (after `@import 'tailwindcss'`), `@layer base` heading rule |
| `apps/web/src/app/AntProvider.tsx` | Add `fontFamily` to `THEME_TOKEN` |

## Out of Scope

- Font subsetting or self-hosting
- Per-component font overrides
- Changing font sizes or line heights
- Applying Nunito (heading font) to `Typography.Title` — deferred; requires a `@layer components` override if desired later
