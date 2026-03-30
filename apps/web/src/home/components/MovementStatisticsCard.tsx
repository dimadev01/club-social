import { InfoCircleOutlined } from '@ant-design/icons';
import { DateFormat, DateFormats, NumberFormat } from '@club-social/shared/lib';
import { Flex, Space, Statistic, Tag, theme, Tooltip, Typography } from 'antd';

import { Card, PageHeading } from '@/ui';

import { useMovementStatistics } from '../useMovementStatistics';
import { HeroStatCard } from './HeroStatCard';

interface Props {
  dateRange?: [string, string];
}

export function MovementStatisticsCard({ dateRange }: Props) {
  const { data: statistics, isLoading } = useMovementStatistics({ dateRange });
  const { token } = theme.useToken();
  const balance = statistics?.balance ?? 0;
  const totalInflow = statistics?.totalInflow ?? 0;
  const totalOutflow = Math.abs(statistics?.totalOutflow ?? 0);
  const total = statistics?.total ?? 0;
  const isPositiveBalance = balance >= 0;

  function getStatusLabel() {
    if (balance === 0) return 'Equilibrado';
    if (isPositiveBalance) return 'Superávit';

    return 'Déficit';
  }

  function getHeroAccentColor() {
    if (balance === 0) return token.colorTextSecondary;
    if (isPositiveBalance) return token.colorSuccess;

    return token.colorError;
  }

  function getStatusTagColor() {
    if (balance === 0) return 'default';
    if (isPositiveBalance) return 'success';

    return 'error';
  }

  const heroBackground = isPositiveBalance
    ? token.colorSuccessBg
    : token.colorErrorBg;

  return (
    <Flex gap="middle" vertical>
      <PageHeading className="mb-0">Movimientos</PageHeading>

      <HeroStatCard
        accentColor={getHeroAccentColor()}
        background={heroBackground}
        label="Balance"
        loading={isLoading}
        rightSlot={
          <Tag color={getStatusTagColor()} variant="solid">
            {getStatusLabel()}
          </Tag>
        }
        showBorder
        subtitle="Diferencia entre ingresos y egresos del período"
        subtitleColor={token.colorTextSecondary}
        value={NumberFormat.currencyCents(balance)}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="h-full">
          <Statistic
            loading={isLoading}
            styles={{
              content: {
                color: token.colorSuccess,
              },
              title: {
                fontSize: token.fontSizeSM,
              },
            }}
            title="Ingresos"
            value={NumberFormat.currencyCents(totalInflow)}
          />
        </Card>

        <Card className="h-full">
          <Statistic
            loading={isLoading}
            styles={{
              content: {
                color: token.colorError,
              },
              title: {
                fontSize: token.fontSizeSM,
              },
            }}
            title="Egresos"
            value={NumberFormat.currencyCents(totalOutflow)}
          />
        </Card>
        <Card className="h-full md:col-span-2 xl:col-span-1">
          <Statistic
            loading={isLoading}
            styles={{
              content: {
                fontSize: token.fontSizeXL,
              },
              title: {
                color: token.colorTextSecondary,
                fontSize: token.fontSizeSM,
              },
            }}
            title={
              <Space size="small">
                <Typography.Text type="secondary">
                  Caja acumulada
                </Typography.Text>
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
