import type { Dayjs } from 'dayjs';

import { InfoCircleOutlined } from '@ant-design/icons';
import { DateFormat, DateFormats, NumberFormat } from '@club-social/shared/lib';
import { Space, Statistic, Tooltip } from 'antd';

import { Card, MovementsIcon } from '@/ui';

import { useMovementStatistics } from '../useMovementStatistics';

interface Props {
  dateRange: [Dayjs, Dayjs] | null;
}

export function MovementStatisticsCard({ dateRange }: Props) {
  const { data: statistics, isLoading } = useMovementStatistics({
    dateRange: dateRange
      ? [DateFormat.isoDate(dateRange[0]), DateFormat.isoDate(dateRange[1])]
      : undefined,
  });

  return (
    <Card
      extra={<MovementsIcon />}
      size="small"
      title="Movimientos"
      type="inner"
    >
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
          title={
            <Space>
              Balance
              <Tooltip title="Diferencia entre ingresos y egresos para el período filtrado">
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
          }
          value={NumberFormat.formatCurrencyCents(statistics?.balance ?? 0)}
        />
      </Card.Grid>
      <Card.Grid className="w-full">
        <Statistic
          loading={isLoading}
          title={
            dateRange ? (
              <Space>
                Total acumulado
                <Tooltip
                  title={`Incluye saldo de caja al ${DateFormat.parse(dateRange[1]).subtract(1, 'day').format(DateFormats.date)}`}
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            ) : (
              'Total acumulado'
            )
          }
          value={NumberFormat.formatCurrencyCents(statistics?.total ?? 0)}
        />
      </Card.Grid>
    </Card>
  );
}
