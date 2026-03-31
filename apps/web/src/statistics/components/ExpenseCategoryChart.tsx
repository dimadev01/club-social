import { MovementType } from '@club-social/shared/movements';

import { CategoryDonutChart } from './CategoryDonutChart';

interface Props {
  dateRange?: [string, string];
}

export function ExpenseCategoryChart({ dateRange }: Props) {
  return (
    <CategoryDonutChart
      dateRange={dateRange}
      title="Egresos por categoría"
      type={MovementType.OUTFLOW}
    />
  );
}
