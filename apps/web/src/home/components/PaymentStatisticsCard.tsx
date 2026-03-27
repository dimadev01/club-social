import { DueCategorySorted } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { Statistic } from 'antd';

import { Card, PaymentsIcon } from '@/ui';

import { usePaymentStatistics } from '../usePaymentStatistics';
import { DueCategoryDescriptions } from './DueCategoryDescriptions';

interface Props {
  dateRange?: [string, string];
}

export function PaymentStatisticsCard({ dateRange }: Props) {
  const { data: statistics, isLoading } = usePaymentStatistics({ dateRange });

  return (
    <Card extra={<PaymentsIcon />} title="Pagos" type="inner">
      <Card.Grid className="w-full sm:w-1/2 lg:w-1/4">
        <Statistic
          loading={isLoading}
          title="Pagos realizados"
          value={statistics?.count}
        />
      </Card.Grid>
      <Card.Grid className="w-full sm:w-1/2 lg:w-1/4">
        <Statistic
          loading={isLoading}
          title="Deudas pagas"
          value={statistics?.paidDuesCount}
        />
      </Card.Grid>
      <Card.Grid className="w-full sm:w-1/2 lg:w-1/4">
        <Statistic
          loading={isLoading}
          title="Total de pagos"
          value={NumberFormat.currencyCents(statistics?.total ?? 0)}
        />
      </Card.Grid>
      <Card.Grid className="w-full sm:w-1/2 lg:w-1/4">
        <Statistic
          loading={isLoading}
          title="Promedio de pago"
          value={NumberFormat.currencyCents(statistics?.average ?? 0)}
        />
      </Card.Grid>

      {DueCategorySorted.map((category) => (
        <Card.Grid className="w-full sm:w-1/2 lg:w-1/3" key={category}>
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
