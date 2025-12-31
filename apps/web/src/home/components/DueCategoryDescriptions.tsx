import type { PaymentStatisticsDto } from '@club-social/shared/payments';

import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { Grid, Skeleton } from 'antd';

import { DueCategoryIconMap } from '@/dues/DueCategoryIconMap';
import { Descriptions } from '@/ui/Descriptions';

interface Props {
  category: DueCategory;
  data?: PaymentStatisticsDto;
  loading?: boolean;
}

export function DueCategoryDescriptions({ category, data, loading }: Props) {
  const { lg } = Grid.useBreakpoint();

  const skeletonOrValue = <T extends React.ReactNode>(value: T) =>
    loading ? <Skeleton.Button active block /> : value;

  return (
    <Descriptions
      extra={DueCategoryIconMap[category]}
      items={[
        {
          children: skeletonOrValue(data?.categories[category].count ?? 0),
          label: 'Cantidad',
        },
        {
          children: skeletonOrValue(
            NumberFormat.formatCurrencyCents(
              data?.categories[category].amount ?? 0,
            ),
          ),
          label: 'Total',
        },
        {
          children: skeletonOrValue(
            NumberFormat.formatCurrencyCents(
              data?.categories[category].average ?? 0,
            ),
          ),
          label: 'Promedio',
        },
      ]}
      layout={lg ? 'horizontal' : 'vertical'}
      title={DueCategoryLabel[category]}
    />
  );
}
