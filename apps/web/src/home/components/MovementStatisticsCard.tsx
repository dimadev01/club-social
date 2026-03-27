import { InfoCircleOutlined } from '@ant-design/icons';
import { DateFormat, DateFormats, NumberFormat } from '@club-social/shared/lib';
import { Space, Statistic, Tooltip } from 'antd';

import { Card, MovementsIcon } from '@/ui';

import { useMovementStatistics } from '../useMovementStatistics';

interface Props {
  dateRange?: [string, string];
}

export function MovementStatisticsCard({ dateRange }: Props) {
  const { data: statistics, isLoading } = useMovementStatistics({ dateRange });

  return (
    <Card extra={<MovementsIcon />} title="Movimientos" type="inner">
      <Card.Grid className="w-full md:w-1/3">
        <Statistic
          loading={isLoading}
          title="Ingresos"
          value={NumberFormat.currencyCents(statistics?.totalInflow ?? 0)}
        />
      </Card.Grid>
      <Card.Grid className="w-full md:w-1/3">
        <Statistic
          loading={isLoading}
          title="Egresos"
          value={NumberFormat.currencyCents(
            Math.abs(statistics?.totalOutflow ?? 0),
          )}
        />
      </Card.Grid>
      <Card.Grid className="w-full md:w-1/3">
        <Statistic
          loading={isLoading}
          title={
            <Space size="small">
              Balance
              <Tooltip title="Diferencia entre ingresos y egresos para el período filtrado">
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
          }
          value={NumberFormat.currencyCents(statistics?.balance ?? 0)}
        />
      </Card.Grid>
      <Card.Grid className="w-full">
        <Statistic
          loading={isLoading}
          title={
            dateRange ? (
              <Space size="small">
                Caja acumulada
                <Tooltip
                  title={`Incluye saldo de caja al ${DateFormat.parse(dateRange[1]).subtract(1, 'day').format(DateFormats.date)}`}
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            ) : (
              'Caja acumulada'
            )
          }
          value={NumberFormat.currencyCents(statistics?.total ?? 0)}
        />
      </Card.Grid>
    </Card>
  );
}
