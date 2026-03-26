# Statistics Revamp — Implementation Plan

> **Audience:** Claude Code (AI coding agent executing this plan)
> **Codebase:** club-social-nest monorepo (apps/api, apps/web, packages/shared)
> **Date:** 2026-03-24

---

## Overview

Revamp the statistics pages (`/statistics/finance` and `/statistics/members`) plus the home dashboard. Work is split into three phases. Each phase is self-contained and deployable.

**Key conventions to follow (from CLAUDE.md):**

- Backend: DDD layers (domain → application → infrastructure → presentation)
- **Read-only statistics queries do NOT need a use case** — the controller injects the repository directly and calls it. Use cases are only for commands (create, update, void). See existing pattern in `movement.controller.ts` lines 170-185 and `member.controller.ts` lines 266-271.
- Repositories: read models (DTOs) for queries, domain entities for commands
- Date fields are stored as `String` in Prisma (ISO format "YYYY-MM-DD") — use string comparisons (`gte`/`lte`) for date range filtering
- Existing `DateRangeRequestDto` in `apps/api/src/shared/presentation/dto/date-range-request.dto.ts` — reuse for date range query params
- Frontend: TanStack Query + query-key-factory, Ant Design v6, Recharts, Tailwind CSS v4
- Shared types: add to `packages/shared/src/<domain>/`, export from index, rebuild with `npm run build`
- Run `npm run check-types` after TypeScript changes

---

## Phase 1 — New Backend Endpoints & Shared Types

This phase adds all the new data endpoints. No frontend changes yet.

### 1.1 Monthly Revenue Trend

**Purpose:** Returns monthly aggregated inflow/outflow/balance for the last N months, powering a line chart.

**New endpoint:** `GET /movements/statistics/monthly-trend`

**Query params:**

```typescript
{
  months?: number; // default 12, max 24 — how many months back from today
}
```

**Response DTO:**

```typescript
interface MovementMonthlyTrendDto {
  months: MovementMonthlyTrendItemDto[];
}

interface MovementMonthlyTrendItemDto {
  month: string; // "2026-03" (YYYY-MM format)
  totalInflow: number; // in cents
  totalOutflow: number;
  balance: number; // inflow - outflow
}
```

**Implementation:**

1. **Shared types** — add `MovementMonthlyTrendDto` and `MovementMonthlyTrendItemDto` to `packages/shared/src/movements/index.ts`
2. **Repository** — add `findMonthlyTrend(months: number)` to `MovementRepository` interface in `apps/api/src/movements/domain/movement.repository.ts`
3. **Prisma repository** — implement in `apps/api/src/movements/infrastructure/prisma-movement.repository.ts`:
   - Query `Movement` where `status = 'registered'`
   - Filter: `date >= firstDayOf(today - N months)`
   - Group by year-month (extract from `date` field, which is a `String` in YYYY-MM-DD format — use `substring(0,7)` or Prisma raw query with `LEFT(date, 7)`)
   - Aggregate: `SUM(amount) WHERE amount > 0` → inflow, `SUM(ABS(amount)) WHERE amount < 0` → outflow, difference → balance
   - Order by month ascending
4. **Presentation** — add to `apps/api/src/movements/presentation/movement.controller.ts`:
   - New `@Get('statistics/monthly-trend')` endpoint
   - Inject repository directly (no use case needed — this is a read-only query, following existing pattern)
   - Query DTO: `GetMonthlyTrendQueryDto` with `@IsOptional() @IsInt() @Min(1) @Max(24) months?: number`
   - Response DTO: `MovementMonthlyTrendResponseDto`
   - Controller calls `this.movementRepository.findMonthlyTrend(query.months ?? 12)` directly
5. **Query key** — add to `apps/web/src/shared/lib/query-keys.ts`: `movements.monthlyTrend`

---

### 1.2 Collection Rate

**Purpose:** Returns what percentage of dues issued in a period were paid vs. pending/partial.

**New endpoint:** `GET /dues/collection-rate`

**Query params:**

```typescript
{
  dateRange?: [string, string]; // optional, defaults to current month
}
```

**Response DTO:**

```typescript
interface DueCollectionRateDto {
  totalDues: number; // count of all non-voided dues in period
  paidDues: number; // count with status 'paid'
  partiallyPaidDues: number; // count with status 'partially-paid'
  pendingDues: number; // count with status 'pending'
  collectionRate: number; // percentage (0-100), paid / totalDues * 100
  totalAmount: number; // total amount of all dues (cents)
  collectedAmount: number; // amount collected (from settlements)
  pendingAmount: number; // amount still pending
}
```

**Implementation:**

1. **Shared types** — add `DueCollectionRateDto` to `packages/shared/src/dues/index.ts`
2. **Repository** — add `findCollectionRate(dateRange?: DateRange)` to `DueRepository` interface
3. **Prisma repository** — implement in `apps/api/src/dues/infrastructure/prisma-due.repository.ts`:
   - Query `Due` where `status != 'voided'` and optionally filter by `date` within range
   - Count by status: `paid`, `partially-paid`, `pending`
   - Sum amounts by status
   - For collected amount: sum `DueSettlement.amount` where settlement status is active
   - Calculate rate: `paidDues / totalDues * 100`
4. **Presentation** — add `@Get('collection-rate')` to `apps/api/src/dues/presentation/due.controller.ts`
   - Inject repository directly, call `this.dueRepository.findCollectionRate(query.dateRange)`
5. **Query key** — add `dues.collectionRate`

---

### 1.3 Debt Aging Breakdown

**Purpose:** Shows how old pending debts are (0-30, 30-60, 60-90, 90+ days).

**New endpoint:** `GET /dues/aging`

**Query params:** none (always calculated from today)

**Response DTO:**

```typescript
interface DueAgingDto {
  brackets: DueAgingBracketDto[];
  total: number; // total pending amount
}

interface DueAgingBracketDto {
  label: string; // "0-30", "30-60", "60-90", "90+"
  minDays: number;
  maxDays: number | null; // null for 90+
  count: number; // number of dues
  amount: number; // total amount in cents
  percentage: number; // percentage of total pending amount
}
```

**Implementation:**

1. **Shared types** — add `DueAgingDto` and `DueAgingBracketDto` to `packages/shared/src/dues/index.ts`
2. **Repository** — add `findAging()` to `DueRepository`
3. **Prisma repository** — implement:
   - Query all `Due` where `status IN ('pending', 'partially-paid')`
   - For each due, calculate days since `date` field (today - due.date)
   - Bucket into: 0-30, 30-60, 60-90, 90+
   - This is best done as a raw SQL query for performance:
     ```sql
     SELECT
       CASE
         WHEN CURRENT_DATE - date::date <= 30 THEN '0-30'
         WHEN CURRENT_DATE - date::date <= 60 THEN '30-60'
         WHEN CURRENT_DATE - date::date <= 90 THEN '60-90'
         ELSE '90+'
       END as bracket,
       COUNT(*) as count,
       SUM(amount) as amount
     FROM "Due"
     WHERE status IN ('pending', 'partially-paid')
     GROUP BY bracket
     ```
   - Note: `date` is stored as `String` in format "YYYY-MM-DD", so cast to date in SQL
4. **Presentation** — add `@Get('aging')` to due controller
   - Inject repository directly, call `this.dueRepository.findAging()`
5. **Query key** — add `dues.aging`

---

### 1.4 Movement Category Distribution

**Purpose:** Breakdown of expenses/income by `MovementCategory` for a period. Replaces the need for a payment mode chart (Movement `mode` is just `automatic`/`manual`, not payment method).

**New endpoint:** `GET /movements/statistics/by-category`

**Query params:**

```typescript
{
  dateRange?: [string, string];
  type?: 'inflow' | 'outflow'; // optional filter, defaults to both
}
```

**Response DTO:**

```typescript
interface MovementByCategoryDto {
  categories: MovementCategoryBreakdownDto[];
  total: number;
}

interface MovementCategoryBreakdownDto {
  category: MovementCategory; // 'buffet' | 'court-rental' | 'employee' | etc.
  amount: number;
  count: number;
  percentage: number; // of total
}
```

**Implementation:**

1. **Shared types** — add to `packages/shared/src/movements/index.ts`
2. **Repository** — add `findByCategory(params)` to `MovementRepository`
3. **Prisma repository** — group by `category`, filter by date range and optional type (amount > 0 for inflow, < 0 for outflow), status = 'registered'
4. **Presentation** — add to movement controller
   - Inject repository directly, call `this.movementRepository.findByCategory(params)`
5. **Query key** — add `movements.byCategory`

---

### 1.5 Member Growth Over Time

**Purpose:** Monthly count of active members over time, based on `createdAt`.

**New endpoint:** `GET /members/statistics/growth`

**Query params:**

```typescript
{
  months?: number; // default 12, max 24
}
```

**Response DTO:**

```typescript
interface MemberGrowthDto {
  months: MemberGrowthItemDto[];
  currentTotal: number;
}

interface MemberGrowthItemDto {
  month: string; // "2026-03"
  newMembers: number; // created this month
  totalActive: number; // cumulative active members at end of month
}
```

**Implementation:**

1. **Shared types** — add to `packages/shared/src/members/index.ts`
2. **Repository** — add `findGrowth(months: number)` to `MemberRepository`
3. **Prisma repository**:
   - Query `Member` where `status = 'active'`
   - Group `createdAt` by month to get `newMembers`
   - For `totalActive`: cumulative sum of new members, or count of members where `createdAt <= endOfMonth` for each month
   - Note: `createdAt` is a `DateTime` field, so use Prisma date functions
4. **Presentation** — add `@Get('statistics/growth')` to member controller
   - Inject repository directly, call `this.memberRepository.findGrowth(query.months ?? 12)`
5. **Query key** — add `members.growth`

---

### 1.6 Member Age Distribution

**Purpose:** Histogram of member ages using `birthDate` field.

**New endpoint:** `GET /members/statistics/age-distribution`

**Response DTO:**

```typescript
interface MemberAgeDistributionDto {
  brackets: MemberAgeBracketDto[];
  averageAge: number | null;
  total: number; // members with birth date set
}

interface MemberAgeBracketDto {
  label: string; // "0-17", "18-25", "26-35", "36-45", "46-55", "56-65", "66+"
  count: number;
  percentage: number;
}
```

**Implementation:**

1. **Shared types** — add to `packages/shared/src/members/index.ts`
2. **Repository** — add `findAgeDistribution()` to `MemberRepository`
3. **Prisma repository**:
   - Query `Member` where `status = 'active'` and `birthDate IS NOT NULL`
   - `birthDate` is stored as `String?` in "YYYY-MM-DD" format
   - Calculate age from birthDate, bucket into ranges
   - Raw SQL recommended:
     ```sql
     SELECT
       CASE
         WHEN age < 18 THEN '0-17'
         WHEN age < 26 THEN '18-25'
         WHEN age < 36 THEN '26-35'
         WHEN age < 46 THEN '36-45'
         WHEN age < 56 THEN '46-55'
         WHEN age < 66 THEN '56-65'
         ELSE '66+'
       END as bracket,
       COUNT(*) as count
     FROM (
       SELECT EXTRACT(YEAR FROM AGE(CURRENT_DATE, "birthDate"::date)) as age
       FROM "Member"
       WHERE status = 'active' AND "birthDate" IS NOT NULL
     ) ages
     GROUP BY bracket
     ORDER BY MIN(age)
     ```
4. **Presentation** — add `@Get('statistics/age-distribution')` to member controller
   - Inject repository directly, call `this.memberRepository.findAgeDistribution()`
5. **Query key** — add `members.ageDistribution`

---

### 1.7 Period Comparison Deltas

**Purpose:** Instead of a separate endpoint, extend the **existing** statistics endpoints to return deltas vs. the previous period. This keeps the API surface clean.

**Modify existing endpoints:**

#### Payments statistics — `GET /payments/statistics`

Add to `PaymentStatisticsDto`:

```typescript
{
  // ... existing fields ...
  previousPeriod?: {
    count: number;
    total: number;
    average: number;
    paidDuesCount: number;
  };
  deltas?: {
    count: number;      // percentage change
    total: number;
    average: number;
    paidDuesCount: number;
  };
}
```

**Logic:** When `dateRange` is provided, calculate the same-length previous period. E.g., if range is March 1-24, previous period is Feb 5-28 (same number of days). Query both periods and compute percentage deltas: `((current - previous) / previous) * 100`.

Add a `compare?: boolean` query param (default `false`) so this is opt-in and doesn't slow down existing calls.

#### Movements statistics — `GET /movements/statistics`

Same pattern — add `previousPeriod` and `deltas` fields to `MovementStatisticsDto` when `compare=true`.

#### Due pending statistics — `GET /dues/pending-statistics`

Same pattern.

**Implementation for all three:**

1. Update shared types in `packages/shared`
2. Update repository methods to accept a `compare` flag
3. In repository: when compare=true, run the same query for previous period, calculate deltas
4. Update response DTOs in presentation layer
5. Frontend hooks already pass `dateRange` — just add `compare: true` to the query

---

### Phase 1 Checklist

After completing all endpoints:

- [ ] Run `npm run build` in `packages/shared`
- [ ] Run `npm run check-types` in `apps/api`
- [ ] Run `npm run test` in `apps/api`
- [ ] Test each endpoint manually with curl or Swagger

---

## Phase 2 — Frontend Statistics Revamp

This phase rebuilds the statistics pages using the new endpoints.

### 2.1 New Hooks

Create these new hooks in `apps/web/src/home/` (following existing pattern):

| Hook                       | Endpoint                                   | File                          |
| -------------------------- | ------------------------------------------ | ----------------------------- |
| `useMovementMonthlyTrend`  | `GET /movements/statistics/monthly-trend`  | `useMovementMonthlyTrend.ts`  |
| `useDueCollectionRate`     | `GET /dues/collection-rate`                | `useDueCollectionRate.ts`     |
| `useDueAging`              | `GET /dues/aging`                          | `useDueAging.ts`              |
| `useMovementByCategory`    | `GET /movements/statistics/by-category`    | `useMovementByCategory.ts`    |
| `useMemberGrowth`          | `GET /members/statistics/growth`           | `useMemberGrowth.ts`          |
| `useMemberAgeDistribution` | `GET /members/statistics/age-distribution` | `useMemberAgeDistribution.ts` |

Each hook follows the existing pattern:

```typescript
export function useMovementMonthlyTrend(query?: { months?: number }) {
  return useQuery({
    ...queryKeys.movements.monthlyTrend(query),
    queryFn: () =>
      $fetch<MovementMonthlyTrendDto>('movements/statistics/monthly-trend', {
        query,
      }),
  });
}
```

Update `apps/web/src/shared/lib/query-keys.ts` with all new query keys.

---

### 2.2 Finance Statistics Page — Redesign

**File:** `apps/web/src/statistics/FinanceStatisticsPage.tsx`

**New layout (top to bottom):**

#### Row 1 — KPI Cards with Deltas (4 columns)

Use Ant Design `Statistic` inside `Card` components in a responsive grid (`Col span={6}`).

| Card                 | Data source                  | Delta                         |
| -------------------- | ---------------------------- | ----------------------------- |
| Ingresos del período | `movementStats.totalInflow`  | vs previous period %          |
| Egresos del período  | `movementStats.totalOutflow` | vs previous period %          |
| Balance del período  | `movementStats.balance`      | vs previous period %          |
| Caja acumulada       | `movementStats.total`        | — (no delta, it's cumulative) |

- Pass `compare: true` to existing `useMovementStatistics` hook
- Use green arrow up / red arrow down for positive/negative deltas
- Ant Design `Statistic` has `prefix` and `suffix` props for this

#### Row 2 — Revenue Trend Chart (full width)

New component: `RevenueTrendChart.tsx`

- **Chart type:** Recharts `AreaChart` with two `Area` elements (inflow in green, outflow in red) and a `Line` for net balance
- **Data:** `useMovementMonthlyTrend({ months: 12 })`
- **X-axis:** month labels (formatted with dayjs Spanish locale)
- **Y-axis:** currency values
- **Tooltip:** show all three values formatted as currency

#### Row 3 — Two columns

**Left: Collection Rate** — new component `CollectionRateCard.tsx`

- Ant Design `Progress` component (type="circle") showing `collectionRate` percentage
- Below: small stats for paid / partial / pending counts
- Data: `useDueCollectionRate({ dateRange })`

**Right: Debt Aging** — new component `DebtAgingCard.tsx`

- Recharts horizontal `BarChart` with 4 bars (one per bracket)
- Color gradient: green (0-30) → yellow (30-60) → orange (60-90) → red (90+)
- Data: `useDueAging()`

#### Row 4 — Two columns

**Left: Expense Category Breakdown** — new component `ExpenseCategoryChart.tsx`

- Recharts `PieChart` (donut) showing outflow by MovementCategory
- Data: `useMovementByCategory({ dateRange, type: 'outflow' })`
- Show top 5 categories + "Otros" bucket

**Right: Payment Stats by Due Type** — existing `PaymentStatisticsCard` (simplified)

- Remove "Promedio" rows
- Show count + total per category (Cuota, Luz, Invitado) as compact cards
- Add delta indicators using `compare: true`

#### Row 5 — Daily Payments Chart (full width)

Keep existing `PaymentChartCard` but improve:

- Add a toggle to switch between "Monto" (amount) and "Cantidad" (count) views
- Add month navigation (prev/next arrows) instead of just a date picker

#### Remove from this page:

- `DuePendingStatisticsCard` as a standalone section (debt info now covered by Debt Aging and Collection Rate)
- The separate "Movimientos" summary card (now in KPI row)

---

### 2.3 Member Statistics Page — Redesign

**File:** `apps/web/src/statistics/MemberStatisticsPage.tsx`

**New layout:**

#### Row 1 — KPI Cards (3 columns)

| Card                 | Data                                                 |
| -------------------- | ---------------------------------------------------- |
| Total socios activos | `memberStats.total`                                  |
| Nuevos este mes      | from `useMemberGrowth` (latest month's `newMembers`) |
| Edad promedio        | from `useMemberAgeDistribution().averageAge`         |

#### Row 2 — Member Growth Chart (full width)

New component: `MemberGrowthChart.tsx`

- Recharts `AreaChart` showing `totalActive` over time (area fill) with `Bar` overlay for `newMembers` per month
- Combination chart (ComposedChart): Area for cumulative + Bar for monthly new
- Data: `useMemberGrowth({ months: 12 })`

#### Row 3 — Three columns

**Left: Socios por categoría** — convert existing table to a `BarChart` (horizontal)

- Bars for each category: Socio, Cadete, Pre-cadete, Adherente
- Keep the count labels on each bar
- Data: existing `memberStats.byCategory`

**Center: Socios por sexo** — keep existing donut chart (it works well)

- No changes needed, just reposition in grid

**Right: Age Distribution** — new component `AgeDistributionChart.tsx`

- Recharts `BarChart` (vertical) — histogram style
- Bars for each age bracket
- Data: `useMemberAgeDistribution()`

#### Row 4 — Top 10 Debtors (full width)

- Keep existing table but add columns: "Antigüedad deuda" (oldest due age in days)
- This can be derived from `DueAging` data or a small addition to the member statistics endpoint

#### Remove:

- The "Socios por categoría" plain table (replaced by chart)

---

### 2.4 Home Dashboard — Cleanup

**File:** `apps/web/src/home/` components

**Changes:**

- **Remove** "Top 5 deudores" table (it's now in Member Statistics with a better Top 10)
- **Replace with** a mini Revenue Trend sparkline (last 6 months, no axes, just the line) linking to `/statistics/finance`
- **Add** a Collection Rate mini-gauge linking to `/statistics/finance`
- **Keep** the 4 quick action buttons (Nueva deuda, Nuevo pago, etc.)
- **Keep** Caja acumulada and Socios activos KPI cards, but add delta indicators

---

### 2.5 Shared Chart Components

Create reusable components in `apps/web/src/shared/components/charts/`:

| Component              | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `DeltaStatistic.tsx`   | Wraps Ant Design `Statistic` with an arrow + percentage delta |
| `CurrencyFormatter.ts` | Utility to format cents as `$ X.XXX` (Argentine format)       |
| `ChartTooltip.tsx`     | Consistent tooltip styling for all Recharts charts            |
| `EmptyChart.tsx`       | Empty state for charts when no data is available              |

---

### Phase 2 Checklist

- [ ] Run `npm run check-types` in `apps/web`
- [ ] Test all pages in browser — verify data loads correctly
- [ ] Verify responsive layout on smaller screens (Ant Design breakpoints)
- [ ] Verify date filtering works on all new charts

---

## Phase 3 — UX Polish & Consistency

### 3.1 Unified Date Filtering

Currently only Finance statistics has date filtering. Add it to Member Statistics too (for growth chart period, collection rate, etc.).

Create a shared `StatisticsDateFilter` component that:

- Syncs with URL search params (existing pattern in FinanceStatisticsPage)
- Has presets: "Este mes", "Últimos 3 meses", "Últimos 6 meses", "Este año"
- Is used on both statistics pages

### 3.2 Responsive Grid Layout

Both statistics pages should use a consistent responsive grid:

```tsx
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} lg={6}>  {/* KPI cards */}
  <Col xs={24} lg={12}>          {/* Half-width charts */}
  <Col xs={24}>                  {/* Full-width charts */}
</Row>
```

### 3.3 Chart Theme Consistency

All charts should use the app's green theme color (`#1a7a2e` or the Ant Design token). Create a `chartTheme.ts`:

```typescript
export const chartColors = {
  primary: '#1a7a2e', // club green
  secondary: '#52c41a', // lighter green
  danger: '#ff4d4f', // red for outflow/debt
  warning: '#faad14', // yellow for partial
  neutral: '#d9d9d9', // gray for unspecified
  gradient: ['#1a7a2e', '#52c41a', '#95de64', '#d9f7be'], // for multi-series
};
```

### 3.4 Loading States

All new chart components should show Ant Design `Skeleton` components while data is loading (consistent with existing cards that show skeleton loaders).

### 3.5 Navigation Between Stats Pages

Add tab navigation at the top of both statistics pages so users can switch between Finance and Members without going back to the sidebar:

```tsx
<Segmented
  options={[
    { label: 'Finanzas', value: 'finance' },
    { label: 'Socios', value: 'members' },
  ]}
  onChange={(value) => navigate(appRoutes.statistics[value])}
/>
```

---

## File Reference — Quick Lookup

### Backend files to modify:

| File                                                                  | Changes                                  |
| --------------------------------------------------------------------- | ---------------------------------------- |
| `apps/api/src/movements/domain/movement.repository.ts`                | Add `findMonthlyTrend`, `findByCategory` |
| `apps/api/src/movements/infrastructure/prisma-movement.repository.ts` | Implement new methods                    |
| `apps/api/src/movements/presentation/movement.controller.ts`          | Add 2 new endpoints                      |
| `apps/api/src/dues/domain/due.repository.ts`                          | Add `findCollectionRate`, `findAging`    |
| `apps/api/src/dues/infrastructure/prisma-due.repository.ts`           | Implement new methods                    |
| `apps/api/src/dues/presentation/due.controller.ts`                    | Add 2 new endpoints                      |
| `apps/api/src/members/domain/member.repository.ts`                    | Add `findGrowth`, `findAgeDistribution`  |
| `apps/api/src/members/infrastructure/prisma-member.repository.ts`     | Implement new methods                    |
| `apps/api/src/members/presentation/member.controller.ts`              | Add 2 new endpoints                      |
| `apps/api/src/payments/infrastructure/prisma-payment.repository.ts`   | Add compare logic                        |
| `apps/api/src/payments/presentation/payment.controller.ts`            | Add `compare` param                      |

### Backend files to create:

No new use cases needed — all statistics are read-only queries handled directly by the controller + repository (following the existing pattern in this codebase). New DTOs will be created alongside existing ones in the presentation layer.

### Shared types to add:

| File                                     | Types                                                          |
| ---------------------------------------- | -------------------------------------------------------------- |
| `packages/shared/src/movements/index.ts` | `MovementMonthlyTrendDto`, `MovementByCategoryDto`             |
| `packages/shared/src/dues/index.ts`      | `DueCollectionRateDto`, `DueAgingDto`                          |
| `packages/shared/src/members/index.ts`   | `MemberGrowthDto`, `MemberAgeDistributionDto`                  |
| `packages/shared/src/payments/index.ts`  | Extend `PaymentStatisticsDto` with `previousPeriod`, `deltas`  |
| `packages/shared/src/movements/index.ts` | Extend `MovementStatisticsDto` with `previousPeriod`, `deltas` |

### Frontend files to create:

| File                                                          | Purpose          |
| ------------------------------------------------------------- | ---------------- |
| `apps/web/src/home/useMovementMonthlyTrend.ts`                | Hook             |
| `apps/web/src/home/useDueCollectionRate.ts`                   | Hook             |
| `apps/web/src/home/useDueAging.ts`                            | Hook             |
| `apps/web/src/home/useMovementByCategory.ts`                  | Hook             |
| `apps/web/src/home/useMemberGrowth.ts`                        | Hook             |
| `apps/web/src/home/useMemberAgeDistribution.ts`               | Hook             |
| `apps/web/src/statistics/components/RevenueTrendChart.tsx`    | Area chart       |
| `apps/web/src/statistics/components/CollectionRateCard.tsx`   | Gauge card       |
| `apps/web/src/statistics/components/DebtAgingCard.tsx`        | Horizontal bar   |
| `apps/web/src/statistics/components/ExpenseCategoryChart.tsx` | Donut chart      |
| `apps/web/src/statistics/components/MemberGrowthChart.tsx`    | Area + bar combo |
| `apps/web/src/statistics/components/AgeDistributionChart.tsx` | Histogram        |
| `apps/web/src/shared/components/charts/DeltaStatistic.tsx`    | Reusable KPI     |
| `apps/web/src/shared/components/charts/ChartTooltip.tsx`      | Tooltip          |
| `apps/web/src/shared/components/charts/EmptyChart.tsx`        | Empty state      |
| `apps/web/src/shared/components/charts/chartTheme.ts`         | Color constants  |

### Frontend files to modify:

| File                                                  | Changes                 |
| ----------------------------------------------------- | ----------------------- |
| `apps/web/src/statistics/FinanceStatisticsPage.tsx`   | Full redesign           |
| `apps/web/src/statistics/MemberStatisticsPage.tsx`    | Full redesign           |
| `apps/web/src/home/components/MainStatisticsCard.tsx` | Simplify, add deltas    |
| `apps/web/src/home/components/PaymentChartCard.tsx`   | Add toggle, improve nav |
| `apps/web/src/shared/lib/query-keys.ts`               | Add new query keys      |

---

## Execution Order

**Phase 1** (backend — do in this order):

1. Add all new shared types to `packages/shared` → run `npm run build` in `packages/shared`
2. Implement 1.1 (monthly trend): repository interface → Prisma implementation → controller endpoint → response DTO
3. Implement 1.2 (collection rate): same pattern
4. Implement 1.3 (debt aging): same pattern (uses raw SQL)
5. Implement 1.4 (movement by category): same pattern
6. Implement 1.5 (member growth): same pattern
7. Implement 1.6 (age distribution): same pattern (uses raw SQL)
8. Implement 1.7 (period comparison deltas) — modify existing endpoints & DTOs
9. Register any new providers in module files if needed
10. Run `npm run check-types` and `npm run test` in `apps/api`

**Phase 2** (frontend — do in this order):

1. Create shared chart components (DeltaStatistic, ChartTooltip, chartTheme, EmptyChart)
2. Create all new hooks
3. Redesign FinanceStatisticsPage
4. Redesign MemberStatisticsPage
5. Update Home dashboard
6. Run check-types

**Phase 3** (polish):

1. Unified date filtering component
2. Responsive grid audit
3. Tab navigation between stats pages
4. Loading states audit
