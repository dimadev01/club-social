import type { Dayjs } from 'dayjs';

import { DueCategorySorted } from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { Statistic } from 'antd';

import { Card } from '@/ui/Card';

import { usePaymentStatistics } from '../usePaymentStatistics';
import { DueCategoryDescriptions } from './DueCategoryDescriptions';

interface Props {
  dateRange: [Dayjs, Dayjs] | null;
}

export function PaymentStatisticsCard({ dateRange }: Props) {
  const { data: statistics, isLoading } = usePaymentStatistics({
    dateRange: dateRange
      ? [DateFormat.isoDate(dateRange[0]), DateFormat.isoDate(dateRange[1])]
      : undefined,
  });

  return (
    <Card size="small" title="Pagos en el período" type="inner">
      <Card.Grid className="w-full md:w-1/3">
        <Statistic
          loading={isLoading}
          title="Cantidad"
          value={statistics?.count}
        />
      </Card.Grid>
      <Card.Grid className="w-full md:w-1/3">
        <Statistic
          loading={isLoading}
          title="Total"
          value={NumberFormat.formatCurrencyCents(statistics?.total ?? 0)}
        />
      </Card.Grid>
      <Card.Grid className="w-full md:w-1/3">
        <Statistic
          loading={isLoading}
          title="Promedio"
          value={NumberFormat.formatCurrencyCents(statistics?.average ?? 0)}
        />
      </Card.Grid>

      {DueCategorySorted.map((category) => (
        <Card.Grid className="w-full md:w-1/3" key={category}>
          <DueCategoryDescriptions
            category={category}
            data={statistics}
            loading={isLoading}
          />
        </Card.Grid>
      ))}
    </Card>
  );
}
