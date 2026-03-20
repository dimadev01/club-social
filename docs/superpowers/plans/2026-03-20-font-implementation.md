# Font Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Nunito (headings) + Nunito Sans (body/UI) font pairing to the Club Social Monte Grande admin web app.

**Architecture:** Load fonts via Google Fonts `@import` in the CSS entry point, register them as Tailwind v4 theme variables, apply Nunito Sans globally via the Ant Design theme token, and apply Nunito to plain HTML headings via a `@layer base` rule.

**Tech Stack:** React, Ant Design v6, Tailwind CSS v4, Vite

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `apps/web/src/index.css` | Modify | Load fonts, register Tailwind variables, apply heading rule |
| `apps/web/src/app/AntProvider.tsx` | Modify | Apply Nunito Sans to all Ant Design components via theme token |

---

### Task 1: Load fonts and configure CSS

**Files:**
- Modify: `apps/web/src/index.css`

- [ ] **Step 1: Add Google Fonts `@import`**

Open `apps/web/src/index.css`. The file currently starts with:

```css
@layer theme, base, antd, components, utilities;

@import url('antd/dist/antd.css') layer(antd);

@import 'tailwindcss';
```

Insert the Google Fonts `@import` after the `@layer` declaration and before the antd import:

```css
@layer theme, base, antd, components, utilities;

@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap');
@import url('antd/dist/antd.css') layer(antd);

@import 'tailwindcss';
```

> **Why this order:** CSS requires `@import` rules to appear before all other rules except `@charset`, `@layer`, and `@namespace`. Placing after the `@layer` declaration and before the antd import is the only valid position.

- [ ] **Step 2: Add `@theme` block after `@import 'tailwindcss'`**

After the `@import 'tailwindcss';` line, add:

```css
@theme {
  --font-sans: 'Nunito Sans', sans-serif;
  --font-heading: 'Nunito', sans-serif;
}
```

This registers the fonts as Tailwind v4 CSS variables, enabling `font-sans` and `font-heading` utility classes throughout the app.

- [ ] **Step 3: Add `@layer base` heading rule**

After the `@theme` block, add:

```css
@layer base {
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}
```

> **Important:** This rule applies Nunito to plain HTML `h1–h6` elements only. It does **not** affect Ant Design `Typography.Title` components — those are covered by the Ant Design theme token in Task 2. The `antd` layer has higher priority than `base` in the declared layer order (`theme, base, antd, components, utilities`), so Ant Design's CSS-in-JS styles will override this rule for any element it controls.

- [ ] **Step 4: Verify the final `index.css` structure**

The file should now read (existing `bounce` animation and `.icon-bounce` class remain unchanged after the imports section):

```css
@layer theme, base, antd, components, utilities;

@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap');
@import url('antd/dist/antd.css') layer(antd);

@import 'tailwindcss';

@theme {
  --font-sans: 'Nunito Sans', sans-serif;
  --font-heading: 'Nunito', sans-serif;
}

@keyframes bounce { ... }

.icon-bounce { ... }

@layer base {
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/index.css
git commit -m "feat(web): load Nunito and Nunito Sans fonts via Google Fonts"
```

---

### Task 2: Apply Nunito Sans to Ant Design components

**Files:**
- Modify: `apps/web/src/app/AntProvider.tsx`

- [ ] **Step 1: Add `fontFamily` to `THEME_TOKEN`**

Open `apps/web/src/app/AntProvider.tsx`. Find the `THEME_TOKEN` constant (around line 19):

```typescript
const THEME_TOKEN: ThemeConfig['token'] = {
  borderRadius: 8,
  colorInfo: PRIMARY_GREEN,
  colorPrimary: PRIMARY_GREEN,
};
```

Add `fontFamily`:

```typescript
const THEME_TOKEN: ThemeConfig['token'] = {
  borderRadius: 8,
  colorInfo: PRIMARY_GREEN,
  colorPrimary: PRIMARY_GREEN,
  fontFamily: "'Nunito Sans', sans-serif",
};
```

This propagates Nunito Sans to all Ant Design components — buttons, inputs, tables, menus, `Typography.Text`, `Typography.Title`, etc.

- [ ] **Step 2: Run type check**

```bash
cd apps/api && npm run check-types 2>&1 | head -20
```

Wait — type check runs from the web app. Run:

```bash
npm run check-types
```

from the repo root, or:

```bash
cd apps/web && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/AntProvider.tsx
git commit -m "feat(web): apply Nunito Sans to Ant Design components via theme token"
```

---

### Task 3: Manual verification

- [ ] **Step 1: Start the dev server**

```bash
cd apps/web && npm run dev
```

or from root:

```bash
npm run dev --workspace=apps/web
```

- [ ] **Step 2: Open the app in a browser and verify**

Check the following:
1. Body text (table cells, form labels, menu items) renders in **Nunito Sans** — rounded, clean sans-serif
2. Page titles (`PageTitle` components, which render as `<h2>`) render in **Nunito** — slightly more rounded than the body
3. Both light and dark themes display the fonts correctly
4. No console errors about failed font loads (check Network tab — Google Fonts request should return 200)

> **Note:** In the current implementation, `Typography.Title` will render in **Nunito Sans** (via the Ant Design token), not Nunito. Plain `<h1>`–`<h6>` outside Ant Design will render in Nunito. If you want `Typography.Title` to use Nunito, a future `@layer components` override would be needed.
