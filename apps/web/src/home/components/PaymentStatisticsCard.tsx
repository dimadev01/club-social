import { purple, purpleDark } from '@ant-design/colors';
import {
  DueCategory,
  DueCategoryLabel,
  DueCategorySorted,
} from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { Flex, Progress, Statistic, theme, Typography } from 'antd';

import { DueCategoryIconMap } from '@/dues/DueCategoryIconMap';
import { Card, PageHeading } from '@/ui';

import { usePaymentStatistics } from '../usePaymentStatistics';

interface Props {
  dateRange?: [string, string];
}

export function PaymentStatisticsCard({ dateRange }: Props) {
  const { data: statistics, isLoading } = usePaymentStatistics({ dateRange });
  const { token } = theme.useToken();

  const isDark = token.colorBgBase === '#000000';
  const categoryColor: Record<DueCategory, string> = {
    [DueCategory.ELECTRICITY]: token.colorWarning,
    [DueCategory.GUEST]: isDark ? purpleDark[5] : purple[5],
    [DueCategory.MEMBERSHIP]: token.colorSuccess,
  };

  return (
    <Flex gap="middle" vertical>
      <PageHeading className="mb-0">Pagos</PageHeading>

      {/* Hero banner */}
      <Card
        style={{
          background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorSuccessActive})`,
        }}
      >
        <Flex align="center" gap="middle" justify="space-between" wrap>
          <Statistic
            classNames={{
              content: 'text-4xl text-white font-bold',
              title: 'text-white uppercase font-bold',
            }}
            loading={isLoading}
            title="Pagos realizados"
            value={statistics?.count ?? 0}
          />

          <Flex align="center" gap="middle" wrap>
            {[
              {
                format: 'number' as const,
                label: 'Deudas pagas',
                value: statistics?.paidDuesCount ?? 0,
              },
              {
                format: 'currency' as const,
                label: 'Total cobrado',
                value: statistics?.total ?? 0,
              },
              {
                format: 'currency' as const,
                label: 'Promedio',
                value: statistics?.average ?? 0,
              },
            ].map(({ format, label, value }) => (
              <Statistic
                classNames={{
                  content: 'text-white text-right text-base font-bold',
                  title: 'text-white text-right text-sm',
                }}
                key={label}
                loading={isLoading}
                title={label}
                value={
                  format === 'currency'
                    ? NumberFormat.currencyCents(value)
                    : value
                }
              />
            ))}
          </Flex>
        </Flex>
      </Card>

      {/* Category cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {DueCategorySorted.map((category) => {
          const categoryData = statistics?.categories[category];
          const isEmpty = !categoryData || categoryData.count === 0;
          const percentage = categoryData?.percentage ?? 0;
          const color = categoryColor[category];

          return (
            <Card key={category} size="small">
              <Flex gap="middle" vertical>
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap="small">
                    {DueCategoryIconMap[category]}
                    <Typography.Text
                      className="text-sm font-semibold"
                      disabled={isEmpty}
                    >
                      {DueCategoryLabel[category]}
                    </Typography.Text>
                  </Flex>
                  <Typography.Text className="text-xs" type="secondary">
                    {isEmpty ? '0%' : `${percentage}%`}
                  </Typography.Text>
                </Flex>

                <Flex gap="small" vertical>
                  <Typography.Text
                    className="text-xs"
                    disabled={isEmpty}
                    type={isEmpty ? undefined : 'secondary'}
                  >
                    Cantidad ·{' '}
                    <Typography.Text
                      className="text-xs font-semibold"
                      disabled={isEmpty}
                    >
                      {categoryData?.count ?? 0}
                    </Typography.Text>
                  </Typography.Text>
                  <Typography.Text
                    className="text-sm font-bold"
                    disabled={isEmpty}
                    style={{ color: isEmpty ? undefined : color }}
                  >
                    {NumberFormat.currencyCents(categoryData?.amount ?? 0)}
                  </Typography.Text>

                  <Progress
                    percent={percentage}
                    showInfo={false}
                    size="small"
                    strokeColor={isEmpty ? token.colorBorder : color}
                  />
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </div>
    </Flex>
  );
}
