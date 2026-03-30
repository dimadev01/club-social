import { InfoCircleOutlined } from '@ant-design/icons';
import { DateFormat, DateFormats, NumberFormat } from '@club-social/shared/lib';
import { Flex, Grid, Space, Statistic, theme, Tooltip, Typography } from 'antd';

import { Card, PageHeading } from '@/ui';

import { useMovementStatistics } from '../useMovementStatistics';

interface Props {
  dateRange?: [string, string];
}

export function MovementStatisticsCard({ dateRange }: Props) {
  const { data: statistics, isLoading } = useMovementStatistics({ dateRange });
  const { token } = theme.useToken();
  const { lg } = Grid.useBreakpoint();

  const balance = statistics?.balance ?? 0;
  const totalInflow = statistics?.totalInflow ?? 0;
  const totalOutflow = Math.abs(statistics?.totalOutflow ?? 0);
  const total = statistics?.total ?? 0;

  const isPositiveBalance = balance >= 0;
  const heroAccentColor =
    balance === 0
      ? token.colorTextSecondary
      : isPositiveBalance
        ? token.colorSuccess
        : token.colorError;
  const heroBackground = isPositiveBalance
    ? token.colorSuccessBg
    : token.colorErrorBg;

  return (
    <Flex gap="middle" vertical>
      <PageHeading className="mb-0">Movimientos</PageHeading>

      <Card
        styles={{
          body: {
            background: heroBackground,
            border: `1px solid ${token.colorBorderSecondary}`,
          },
        }}
      >
        <Flex gap="middle" justify="space-between" vertical={!lg}>
          <Flex gap="small" vertical>
            <Space size="small">
              <Typography.Text
                className="uppercase"
                strong
                style={{
                  color: heroAccentColor,
                }}
              >
                Balance
              </Typography.Text>
              <Tooltip title="Diferencia entre ingresos y egresos para el período filtrado">
                <InfoCircleOutlined style={{ color: heroAccentColor }} />
              </Tooltip>
            </Space>

            <Statistic
              classNames={{
                content: 'text-4xl font-bold',
              }}
              loading={isLoading}
              styles={{
                content: {
                  color: heroAccentColor,
                },
              }}
              value={NumberFormat.currencyCents(balance)}
            />
          </Flex>
        </Flex>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <Statistic
            loading={isLoading}
            styles={{
              content: {
                color: token.colorSuccess,
              },
            }}
            title="Ingresos"
            value={NumberFormat.currencyCents(totalInflow)}
          />
        </Card>

        <Card>
          <Statistic
            loading={isLoading}
            styles={{
              content: {
                color: token.colorError,
              },
            }}
            title="Egresos"
            value={NumberFormat.currencyCents(totalOutflow)}
          />
        </Card>
        <Card>
          <Statistic
            loading={isLoading}
            title={
              <Space size="small">
                Caja acumulada
                <Tooltip
                  title={
                    dateRange
                      ? `Incluye saldo de caja al ${DateFormat.parse(dateRange[1]).subtract(1, 'day').format(DateFormats.date)}`
                      : 'Saldo de caja acumulado hasta la fecha'
                  }
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            }
            value={NumberFormat.currencyCents(total)}
          />
        </Card>
      </div>
    </Flex>
  );
}
