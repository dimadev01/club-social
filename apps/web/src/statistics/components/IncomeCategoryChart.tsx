import { MovementType } from '@club-social/shared/movements';

import { CategoryDonutChart } from './CategoryDonutChart';

interface Props {
  dateRange?: [string, string];
}

export function IncomeCategoryChart({ dateRange }: Props) {
  return (
    <CategoryDonutChart
      dateRange={dateRange}
      title="Ingresos por categoría"
      type={MovementType.INFLOW}
    />
  );
}
