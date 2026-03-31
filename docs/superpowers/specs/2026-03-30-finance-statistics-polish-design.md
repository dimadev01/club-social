# Finance Statistics — UI Polish Design

**Date:** 2026-03-30
**Branch:** stats
**Scope:** Four components in `FinanceStatisticsPage` — CollectionRateCard, DebtAgingCard, ExpenseCategoryChart, IncomeCategoryChart

## Context

The Finance Statistics page has four cards below the revenue trend chart that needed polishing for consistency, correctness, and UI/UX harmony with the rest of the page. During review, the CollectionRateCard was deemed unnecessary and will be removed entirely. The two category donut charts have near-identical duplicated implementations. The DebtAgingCard has visual and accuracy issues.

---

## 1. CollectionRateCard — Full Deletion

The card, its hook, and its backend endpoint are removed entirely.

### Frontend deletions
- **DELETE** `apps/web/src/statistics/components/CollectionRateCard.tsx`
- **DELETE** `apps/web/src/home/useDueCollectionRate.ts`

### Frontend modifications
- `apps/web/src/statistics/FinanceStatisticsPage.tsx` — remove import and `<CollectionRateCard dateRange={dateRange} />` usage
- `apps/web/src/shared/lib/query-keys.ts` — remove `collectionRate` query key entry from `dues` keys

### Backend deletions
- **DELETE** `apps/api/src/dues/presentation/dto/due-collection-rate.dto.ts`

### Backend modifications
- `apps/api/src/dues/presentation/due.controller.ts` — remove `GET /dues/collection-rate` endpoint method and its imports
- `apps/api/src/dues/domain/due.repository.ts` — remove `findCollectionRate()` method from the repository interface
- `apps/api/src/dues/infrastructure/prisma-due.repository.ts` — remove `findCollectionRate()` implementation

### Shared package
- `packages/shared/src/dues/due.dto.ts` — remove `DueCollectionRateDto` interface and its export from `packages/shared/src/dues/index.ts`

---

## 2. DebtAgingCard — Polish

File: `apps/web/src/statistics/components/DebtAgingCard.tsx`

### Changes
1. **Add Spanish subtitle** — short description below the card title explaining this shows all pending dues grouped by age, not filtered by date. Use Ant Design `Typography.Text` as a `extra` prop or subtitle below the card title. Suggested text: *"Cuotas pendientes agrupadas por antigüedad. No se filtra por período."*

2. **Increase chart height** — change `h-48` (192px) to `h-56` (224px) for more breathing room between bars.

3. **Fix hardcoded color** — replace `'#fa8c16'` in `barColors` array with `token.colorWarningActive` to stay consistent with the theme token system.

4. **Fix YAxis tickFormatter** — the `data.brackets[].label` field already contains the range string (e.g. `"0-30"`). The current formatter appends `d` producing `"0-30d"`. Remove the formatter entirely or change it to just return `value` as-is; the `d` suffix is redundant and looks odd on range labels.

5. **Add total pending amount** — compute `data.brackets.reduce((sum, b) => sum + b.amount, 0)` and display it in the `extra` prop of the `<Card>` using `NumberFormat.currencyCents()`.

---

## 3. CategoryDonutChart — New Shared Component

File to create: `apps/web/src/statistics/components/CategoryDonutChart.tsx`

This component contains all the shared logic currently duplicated between `ExpenseCategoryChart` and `IncomeCategoryChart`.

### Props interface
```typescript
interface Props {
  dateRange?: [string, string];
  title: string;
  type: MovementType;
}
```

### Shared color palette
Define a single `CHART_COLORS` array derived from theme tokens — same order for both INFLOW and OUTFLOW so the same category gets the same color across both charts:
```typescript
const colors = [
  token.colorPrimary,
  token.colorSuccess,
  token.colorWarning,
  token.colorError,
  token.colorInfo,
  token.colorTextSecondary,
];
```

### Grouped remainder label
Rename the grouped "other" bucket from `"Otros"` to `` `Otros (${rest.length})` `` to avoid collision when a real category is also named "Otros".

### Total amount in donut center
Use Recharts `<Label>` inside `<Pie>` to render the total formatted amount in the center of the donut hole:
```tsx
<Pie dataKey="amount" innerRadius="55%" outerRadius="80%" ...>
  <Label
    content={({ viewBox }) => {
      // render two SVG <text> elements: formatted total on top, "total" label below
      // use viewBox.cx / viewBox.cy for centering
    }}
    position="center"
  />
</Pie>
```
The total is `data.categories.reduce((sum, c) => sum + c.amount, 0)` formatted with `NumberFormat.currencyCents()`.

### Card wrapper removed
`CategoryDonutChart` does **not** wrap itself in a `<Card>`. It renders the chart directly (heading + chart content). The `PageHeading` pattern is used at the page level (see section 4).

### Empty state
Same as current: `<Empty description="Sin {tipo} registrados" />` at `h-64` height.

### CustomTooltip
Same as current implementation — moved into `CategoryDonutChart.tsx`.

---

## 4. ExpenseCategoryChart + IncomeCategoryChart — Thin Wrappers

Both files are simplified to delegate entirely to `CategoryDonutChart`.

### ExpenseCategoryChart
```tsx
export function ExpenseCategoryChart({ dateRange }: { dateRange?: [string, string] }) {
  return (
    <CategoryDonutChart
      dateRange={dateRange}
      title="Egresos por categoría"
      type={MovementType.OUTFLOW}
    />
  );
}
```

### IncomeCategoryChart
```tsx
export function IncomeCategoryChart({ dateRange }: { dateRange?: [string, string] }) {
  return (
    <CategoryDonutChart
      dateRange={dateRange}
      title="Ingresos por categoría"
      type={MovementType.INFLOW}
    />
  );
}
```

---

## 5. FinanceStatisticsPage — Layout Update

File: `apps/web/src/statistics/FinanceStatisticsPage.tsx`

The two category charts currently sit inside a bare grid. Wrap them in a `PageHeading` section consistent with the rest of the page:

```tsx
<div>
  <PageHeading>Movimientos por categoría</PageHeading>
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <ExpenseCategoryChart dateRange={dateRange} />
    <IncomeCategoryChart dateRange={dateRange} />
  </div>
</div>
```

Remove the `CollectionRateCard` import and usage.

---

## Verification

1. Run `npm run check-types` — no TypeScript errors
2. Confirm `GET /dues/collection-rate` returns 404
3. Open Finance Statistics page — CollectionRateCard is gone from the layout
4. DebtAgingCard shows subtitle, taller chart, correct YAxis labels, total in header
5. Both donut charts render with total amount in the center of the donut
6. Both donut charts share the same color for the same category
7. Grouped remainder shows "Otros (N)" not "Otros"
8. Both charts are wrapped under the "Movimientos por categoría" PageHeading
