import type { Dayjs } from 'dayjs';

import { NumberFormat } from '@club-social/shared/lib';
import { Statistic } from 'antd';

import { Card } from '@/ui/Card';

import { useMovementStatistics } from '../useMovementStatistics';

interface Props {
  dateRange: [Dayjs, Dayjs] | null;
}

export function MovementStatisticsCard({ dateRange }: Props) {
  const { data: statistics, isLoading } = useMovementStatistics({
    dateRange: dateRange
      ? [dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD')]
      : undefined,
  });

  return (
    <Card size="small" title="Movimientos en el período" type="inner">
      <Card.Grid className="w-full md:w-1/3">
        <Statistic
          loading={isLoading}
          title="Ingresos"
          value={NumberFormat.formatCurrencyCents(statistics?.totalInflow ?? 0)}
        />
      </Card.Grid>
      <Card.Grid className="w-full md:w-1/3">
        <Statistic
          loading={isLoading}
          title="Egresos"
          value={NumberFormat.formatCurrencyCents(
            statistics?.totalOutflow ?? 0,
          )}
        />
      </Card.Grid>
      <Card.Grid className="w-full md:w-1/3">
        <Statistic
          loading={isLoading}
          title="Balance"
          value={NumberFormat.formatCurrencyCents(statistics?.balance ?? 0)}
        />
      </Card.Grid>
      <Card.Grid className="w-full">
        <Statistic
          loading={isLoading}
          title="Total"
          value={NumberFormat.formatCurrencyCents(statistics?.total ?? 0)}
        />
      </Card.Grid>
    </Card>
  );
}
