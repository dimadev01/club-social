# Finance Statistics Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove CollectionRateCard entirely (frontend + backend), polish DebtAgingCard, and extract a shared CategoryDonutChart component used by both Expense and Income charts with total shown in the donut center.

**Architecture:** CollectionRateCard is deleted across all layers. DebtAgingCard gets visual fixes and a subtitle. A new `CategoryDonutChart` shared component is created; `ExpenseCategoryChart` and `IncomeCategoryChart` become thin wrappers. `FinanceStatisticsPage` gains a `PageHeading` section for the two charts.

**Tech Stack:** React, TypeScript, Ant Design v6, Recharts, TanStack Query, NestJS, Prisma, `@club-social/shared`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| DELETE | `apps/web/src/statistics/components/CollectionRateCard.tsx` | UI card component |
| DELETE | `apps/web/src/home/useDueCollectionRate.ts` | React query hook |
| DELETE | `apps/api/src/dues/presentation/dto/due-collection-rate.dto.ts` | API response DTO |
| MODIFY | `apps/api/src/dues/presentation/due.controller.ts` | Remove endpoint |
| MODIFY | `apps/api/src/dues/domain/due.repository.ts` | Remove interface method |
| MODIFY | `apps/api/src/dues/infrastructure/prisma-due.repository.ts` | Remove implementation |
| MODIFY | `packages/shared/src/dues/due.dto.ts` | Remove shared DTO |
| MODIFY | `packages/shared/src/dues/index.ts` | Remove export |
| MODIFY | `apps/web/src/shared/lib/query-keys.ts` | Remove query key |
| MODIFY | `apps/web/src/statistics/components/DebtAgingCard.tsx` | Visual polish |
| CREATE | `apps/web/src/statistics/components/CategoryDonutChart.tsx` | Shared donut chart |
| MODIFY | `apps/web/src/statistics/components/ExpenseCategoryChart.tsx` | Thin wrapper |
| MODIFY | `apps/web/src/statistics/components/IncomeCategoryChart.tsx` | Thin wrapper |
| MODIFY | `apps/web/src/statistics/FinanceStatisticsPage.tsx` | Layout + remove card |

---

### Task 1: Remove CollectionRateCard backend — repository interface

**Files:**
- Modify: `apps/api/src/dues/domain/due.repository.ts`

- [ ] **Read the file** to see current content around `findCollectionRate`:

```bash
grep -n "findCollectionRate\|CollectionRate" apps/api/src/dues/domain/due.repository.ts
```

- [ ] **Remove `findCollectionRate` from the repository interface** — delete the method signature (and any related import of `DueCollectionRateDto` or similar). Leave everything else intact.

- [ ] **Verify no TypeScript errors from this file alone**:

```bash
cd /Users/dmitriy.mironov/Dev/club-social-nest && npx tsc --noEmit -p apps/api/tsconfig.app.json 2>&1 | grep "due.repository" | head -20
```

Expected: no errors from `due.repository.ts` (other files may still error — that's fine at this step).

- [ ] **Commit**:

```bash
git add apps/api/src/dues/domain/due.repository.ts
git commit -m "feat(dues): remove findCollectionRate from repository interface"
```

---

### Task 2: Remove CollectionRateCard backend — repository implementation

**Files:**
- Modify: `apps/api/src/dues/infrastructure/prisma-due.repository.ts`

- [ ] **Read the relevant section**:

```bash
grep -n "findCollectionRate\|CollectionRate" apps/api/src/dues/infrastructure/prisma-due.repository.ts
```

- [ ] **Remove the `findCollectionRate()` method implementation** — delete the entire method body. Remove any imports that are only used by this method (e.g. `DueCollectionRateResponseDto`).

- [ ] **Verify**:

```bash
npx tsc --noEmit -p apps/api/tsconfig.app.json 2>&1 | grep "prisma-due.repository" | head -20
```

Expected: no errors from `prisma-due.repository.ts`.

- [ ] **Commit**:

```bash
git add apps/api/src/dues/infrastructure/prisma-due.repository.ts
git commit -m "feat(dues): remove findCollectionRate repository implementation"
```

---

### Task 3: Remove CollectionRateCard backend — controller endpoint and DTO

**Files:**
- Modify: `apps/api/src/dues/presentation/due.controller.ts`
- Delete: `apps/api/src/dues/presentation/dto/due-collection-rate.dto.ts`

- [ ] **Read the controller to locate the endpoint**:

```bash
grep -n "collection-rate\|CollectionRate\|collectionRate\|DueCollectionRate" apps/api/src/dues/presentation/due.controller.ts
```

- [ ] **Remove the `GET /dues/collection-rate` endpoint method** from the controller. Also remove any imports that are now unused (e.g. `GetCollectionRateQueryRequestDto`, `DueCollectionRateResponseDto`).

- [ ] **Delete the DTO file**:

```bash
rm apps/api/src/dues/presentation/dto/due-collection-rate.dto.ts
```

- [ ] **Verify**:

```bash
npx tsc --noEmit -p apps/api/tsconfig.app.json 2>&1 | grep -E "due.controller|due-collection-rate" | head -20
```

Expected: no errors from those files.

- [ ] **Commit**:

```bash
git add -A apps/api/src/dues/presentation/
git commit -m "feat(dues): remove collection-rate endpoint and DTO"
```

---

### Task 4: Remove CollectionRateCard shared DTO

**Files:**
- Modify: `packages/shared/src/dues/due.dto.ts`
- Modify: `packages/shared/src/dues/index.ts`

- [ ] **Read the files**:

```bash
grep -n "CollectionRate" packages/shared/src/dues/due.dto.ts
grep -n "CollectionRate" packages/shared/src/dues/index.ts
```

- [ ] **Remove `DueCollectionRateDto`** from `due.dto.ts` — delete the interface definition.

- [ ] **Remove the export** of `DueCollectionRateDto` from `packages/shared/src/dues/index.ts` if it's explicitly re-exported there.

- [ ] **Rebuild the shared package**:

```bash
cd packages/shared && npm run build 2>&1 | tail -10
```

Expected: build succeeds with no errors.

- [ ] **Commit**:

```bash
cd /Users/dmitriy.mironov/Dev/club-social-nest
git add packages/shared/src/dues/due.dto.ts packages/shared/src/dues/index.ts
git commit -m "feat(shared): remove DueCollectionRateDto"
```

---

### Task 5: Remove CollectionRateCard frontend — hook, query key, component, page usage

**Files:**
- Delete: `apps/web/src/home/useDueCollectionRate.ts`
- Delete: `apps/web/src/statistics/components/CollectionRateCard.tsx`
- Modify: `apps/web/src/shared/lib/query-keys.ts`
- Modify: `apps/web/src/statistics/FinanceStatisticsPage.tsx`

- [ ] **Delete the hook and component files**:

```bash
rm apps/web/src/home/useDueCollectionRate.ts
rm apps/web/src/statistics/components/CollectionRateCard.tsx
```

- [ ] **Remove `collectionRate` query key from `query-keys.ts`**. Read the file first:

```bash
grep -n "collectionRate\|collection" apps/web/src/shared/lib/query-keys.ts
```

Delete the `collectionRate` entry from the `dues` keys object.

- [ ] **Remove CollectionRateCard from `FinanceStatisticsPage.tsx`**. Read the file:

```bash
grep -n "CollectionRate\|collectionRate" apps/web/src/statistics/FinanceStatisticsPage.tsx
```

Remove the import line and the `<CollectionRateCard dateRange={dateRange} />` JSX element.

- [ ] **Verify no TypeScript errors**:

```bash
npx tsc --noEmit -p apps/web/tsconfig.app.json 2>&1 | head -30
```

Expected: no errors.

- [ ] **Commit**:

```bash
git add -A apps/web/src/home/useDueCollectionRate.ts apps/web/src/statistics/components/CollectionRateCard.tsx apps/web/src/shared/lib/query-keys.ts apps/web/src/statistics/FinanceStatisticsPage.tsx
git commit -m "feat(stats): remove CollectionRateCard from frontend"
```

---

### Task 6: Polish DebtAgingCard

**Files:**
- Modify: `apps/web/src/statistics/components/DebtAgingCard.tsx`

- [ ] **Read the current file**:

```bash
cat apps/web/src/statistics/components/DebtAgingCard.tsx
```

- [ ] **Apply all four visual fixes** — replace the entire file content with the polished version:

  1. Add `Typography` import from `antd`
  2. Replace hardcoded `'#fa8c16'` with `token.colorWarningActive`
  3. Remove the `d` suffix from `YAxis tickFormatter` (just return `value` as-is)
  4. Change chart height class from `h-48` to `h-56`
  5. Add total pending amount computed from brackets in the `extra` prop of `<Card>`
  6. Add Spanish subtitle inside the card body (before the chart) using `Typography.Text`

The card `extra` and subtitle additions:
```tsx
// Compute total at top of component (after the hasData check):
const totalAmount = data?.brackets.reduce((sum, b) => sum + b.amount, 0) ?? 0;

// Card extra prop:
extra={data && <Typography.Text type="secondary">{NumberFormat.currencyCents(totalAmount)}</Typography.Text>}

// Subtitle inside card body, above the chart:
<Typography.Text style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
  Cuotas pendientes agrupadas por antigüedad. No se filtra por período.
</Typography.Text>
```

The YAxis tickFormatter fix:
```tsx
// Before:
tickFormatter={(value: string) => `${value}d`}
// After — remove the tickFormatter prop entirely, or:
tickFormatter={(value: string) => value}
```

The barColors fix:
```tsx
// Before:
const barColors = [
  token.colorSuccess,
  token.colorWarning,
  '#fa8c16',
  token.colorError,
];
// After:
const barColors = [
  token.colorSuccess,
  token.colorWarning,
  token.colorWarningActive,
  token.colorError,
];
```

- [ ] **Verify TypeScript**:

```bash
npx tsc --noEmit -p apps/web/tsconfig.app.json 2>&1 | grep "DebtAgingCard" | head -10
```

Expected: no errors.

- [ ] **Commit**:

```bash
git add apps/web/src/statistics/components/DebtAgingCard.tsx
git commit -m "feat(stats): polish DebtAgingCard — subtitle, height, token colors, axis labels, total amount"
```

---

### Task 7: Create CategoryDonutChart shared component

**Files:**
- Create: `apps/web/src/statistics/components/CategoryDonutChart.tsx`

- [ ] **Create the file** with the following content:

```tsx
import { NumberFormat } from '@club-social/shared/lib';
import {
  MovementCategoryLabel,
  MovementType,
} from '@club-social/shared/movements';
import { Empty, theme } from 'antd';
import { useMemo } from 'react';
import {
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { useMovementByCategory } from '@/home/useMovementByCategory';

const TOP_N = 5;

interface Props {
  dateRange?: [string, string];
  type: MovementType;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

interface TooltipPayloadItem {
  payload: { amount: number; name: string; percentage: number };
}

interface CenterLabelProps {
  total: number;
  viewBox?: { cx: number; cy: number };
}

function CenterLabel({ total, viewBox }: CenterLabelProps) {
  if (!viewBox) return null;
  const { cx, cy } = viewBox;
  return (
    <>
      <text
        dominantBaseline="middle"
        fill="currentColor"
        style={{ fontSize: 13, fontWeight: 700 }}
        textAnchor="middle"
        x={cx}
        y={cy - 8}
      >
        {NumberFormat.currencyCents(total)}
      </text>
      <text
        dominantBaseline="middle"
        fill="currentColor"
        style={{ fontSize: 10, opacity: 0.55 }}
        textAnchor="middle"
        x={cx}
        y={cy + 10}
      >
        total
      </text>
    </>
  );
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { amount, name, percentage } = payload[0].payload;
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{name}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ color: '#888' }}>Monto:</span>
        <span style={{ fontWeight: 500 }}>{NumberFormat.currencyCents(amount)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ color: '#888' }}>Del total:</span>
        <span style={{ fontWeight: 500 }}>{percentage}%</span>
      </div>
    </div>
  );
}

export function CategoryDonutChart({ dateRange, type }: Props) {
  const { token } = theme.useToken();

  const { data, isLoading } = useMovementByCategory({ dateRange, type });

  const colors = [
    token.colorPrimary,
    token.colorSuccess,
    token.colorWarning,
    token.colorError,
    token.colorInfo,
    token.colorTextSecondary,
  ];

  const { chartData, total } = useMemo(() => {
    if (!data?.categories.length) return { chartData: [], total: 0 };

    const top = data.categories.slice(0, TOP_N);
    const rest = data.categories.slice(TOP_N);

    const items = top.map((c, index) => ({
      amount: c.amount,
      fill: colors[index % colors.length],
      name:
        MovementCategoryLabel[
          c.category as keyof typeof MovementCategoryLabel
        ] ?? c.category,
      percentage: c.percentage,
    }));

    if (rest.length > 0) {
      const othersAmount = rest.reduce((sum, c) => sum + c.amount, 0);
      const othersPercentage = rest.reduce((sum, c) => sum + c.percentage, 0);
      items.push({
        amount: othersAmount,
        fill: colors[top.length % colors.length],
        name: `Otros (${rest.length})`,
        percentage: othersPercentage,
      });
    }

    const computedTotal = data.categories.reduce((sum, c) => sum + c.amount, 0);
    return { chartData: items, total: computedTotal };
  }, [data, token]);

  const hasData = chartData.length > 0;

  if (isLoading) {
    return (
      <div className="h-64" style={{ background: token.colorBgContainer, borderRadius: token.borderRadiusLG }} />
    );
  }

  return (
    <div>
      {!hasData && (
        <div className="flex h-64 items-center justify-center">
          <Empty description={`Sin ${type === MovementType.OUTFLOW ? 'egresos' : 'ingresos'} registrados`} />
        </div>
      )}

      {hasData && (
        <div className="h-64">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={chartData}
                dataKey="amount"
                innerRadius="55%"
                nameKey="name"
                outerRadius="80%"
                paddingAngle={2}
                stroke="none"
              >
                <Label
                  content={(props) => (
                    <CenterLabel total={total} viewBox={props.viewBox as { cx: number; cy: number }} />
                  )}
                  position="center"
                />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: token.colorText, fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Verify TypeScript**:

```bash
npx tsc --noEmit -p apps/web/tsconfig.app.json 2>&1 | grep "CategoryDonutChart" | head -10
```

Expected: no errors.

- [ ] **Commit**:

```bash
git add apps/web/src/statistics/components/CategoryDonutChart.tsx
git commit -m "feat(stats): add CategoryDonutChart shared component with center total label"
```

---

### Task 8: Simplify ExpenseCategoryChart and IncomeCategoryChart

**Files:**
- Modify: `apps/web/src/statistics/components/ExpenseCategoryChart.tsx`
- Modify: `apps/web/src/statistics/components/IncomeCategoryChart.tsx`

- [ ] **Replace `ExpenseCategoryChart.tsx`** with the thin wrapper:

```tsx
import { MovementType } from '@club-social/shared/movements';

import { CategoryDonutChart } from './CategoryDonutChart';

interface Props {
  dateRange?: [string, string];
}

export function ExpenseCategoryChart({ dateRange }: Props) {
  return (
    <CategoryDonutChart
      dateRange={dateRange}
      type={MovementType.OUTFLOW}
    />
  );
}
```

- [ ] **Replace `IncomeCategoryChart.tsx`** with the thin wrapper:

```tsx
import { MovementType } from '@club-social/shared/movements';

import { CategoryDonutChart } from './CategoryDonutChart';

interface Props {
  dateRange?: [string, string];
}

export function IncomeCategoryChart({ dateRange }: Props) {
  return (
    <CategoryDonutChart
      dateRange={dateRange}
      type={MovementType.INFLOW}
    />
  );
}
```

- [ ] **Verify TypeScript**:

```bash
npx tsc --noEmit -p apps/web/tsconfig.app.json 2>&1 | head -20
```

Expected: no errors.

- [ ] **Commit**:

```bash
git add apps/web/src/statistics/components/ExpenseCategoryChart.tsx apps/web/src/statistics/components/IncomeCategoryChart.tsx
git commit -m "refactor(stats): simplify ExpenseCategoryChart and IncomeCategoryChart to thin wrappers"
```

---

### Task 9: Update FinanceStatisticsPage layout

**Files:**
- Modify: `apps/web/src/statistics/FinanceStatisticsPage.tsx`

- [ ] **Read the current page file**:

```bash
cat apps/web/src/statistics/FinanceStatisticsPage.tsx
```

- [ ] **Add `PageHeading` import** if not already present — it's exported from `@/ui`. Check:

```bash
grep "PageHeading" apps/web/src/statistics/FinanceStatisticsPage.tsx
```

- [ ] **Wrap the two category charts** in a `PageHeading` section. Replace the bare grid:

```tsx
// Before:
<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
  <ExpenseCategoryChart dateRange={dateRange} />
  <IncomeCategoryChart dateRange={dateRange} />
</div>

// After:
<div>
  <PageHeading>Movimientos por categoría</PageHeading>
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <ExpenseCategoryChart dateRange={dateRange} />
    <IncomeCategoryChart dateRange={dateRange} />
  </div>
</div>
```

- [ ] **Verify TypeScript**:

```bash
npx tsc --noEmit -p apps/web/tsconfig.app.json 2>&1 | head -20
```

Expected: no errors.

- [ ] **Commit**:

```bash
git add apps/web/src/statistics/FinanceStatisticsPage.tsx
git commit -m "feat(stats): wrap category charts under PageHeading section"
```

---

### Task 10: Final type check and verification

- [ ] **Full TypeScript check across all packages**:

```bash
cd /Users/dmitriy.mironov/Dev/club-social-nest && npm run check-types 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Confirm `GET /dues/collection-rate` is gone** from the controller:

```bash
grep -r "collection-rate" apps/api/src/
```

Expected: no results.

- [ ] **Confirm no remaining references to deleted files**:

```bash
grep -r "CollectionRateCard\|useDueCollectionRate\|DueCollectionRateDto" apps/ packages/ --include="*.ts" --include="*.tsx"
```

Expected: no results.

- [ ] **Confirm `CategoryDonutChart` is the only place chart logic lives**:

```bash
grep -r "useMovementByCategory" apps/web/src/ --include="*.tsx" --include="*.ts"
```

Expected: only `CategoryDonutChart.tsx` and `useMovementByCategory.ts` itself.
