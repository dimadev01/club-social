import type { IPaymentStatisticsDto } from '@club-social/shared/payments';

import { type DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';

import { Descriptions } from '@/ui/Descriptions';

interface Props {
  category: DueCategory;
  data?: IPaymentStatisticsDto;
}

export function DueCategoryDescriptions({ category, data }: Props) {
  return (
    <Descriptions
      items={[
        {
          children: data?.categories[category].count ?? 0,
          label: 'Cantidad',
        },
        {
          children: NumberFormat.formatCurrencyCents(
            data?.categories[category].amount ?? 0,
          ),
          label: 'Total',
        },
        {
          children: NumberFormat.formatCurrencyCents(
            data?.categories[category].average ?? 0,
          ),
          label: 'Promedio',
        },
      ]}
      title={DueCategoryLabel[category]}
    />
  );
}
