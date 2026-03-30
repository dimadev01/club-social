import { purple, purpleDark } from '@ant-design/colors';
import {
  DueCategory,
  DueCategoryLabel,
  DueCategorySorted,
} from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { Flex, Grid, Space, Statistic, theme, Typography } from 'antd';

import { DueCategoryIconMap } from '@/dues/DueCategoryIconMap';
import { cn } from '@/shared/lib/utils';
import { Card, PageHeading } from '@/ui';

import { usePaymentStatistics } from '../usePaymentStatistics';

interface Props {
  dateRange?: [string, string];
}

export function PaymentStatisticsCard({ dateRange }: Props) {
  const { data: statistics, isLoading } = usePaymentStatistics({ dateRange });
  const { token } = theme.useToken();
  const { lg, md } = Grid.useBreakpoint();

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
        <Flex gap="large" justify="space-between" vertical={!lg}>
          <Statistic
            classNames={{
              content: 'text-4xl text-white font-bold',
              title: 'text-white text-base uppercase font-bold',
            }}
            loading={isLoading}
            title="Pagos realizados"
            value={statistics?.count ?? 0}
          />

          <Flex gap={!lg ? 24 : 36} vertical={!md}>
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
                  content: cn('text-white text-2xl font-bold', {
                    'text-right': lg,
                  }),
                  title: cn('text-white text-base', {
                    'text-right': lg,
                  }),
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
          const color = categoryColor[category];

          return (
            <Card key={category}>
              <Flex gap="middle" vertical>
                <Statistic
                  loading={isLoading}
                  prefix={DueCategoryIconMap[category]}
                  styles={{
                    content: {
                      color: isEmpty ? token.colorTextDisabled : color,
                    },
                  }}
                  title={
                    <Space size="small">
                      <Typography.Text strong type="secondary">
                        {DueCategoryLabel[category]}
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        ({categoryData?.count ?? 0})
                      </Typography.Text>
                    </Space>
                  }
                  value={NumberFormat.currencyCents(categoryData?.amount ?? 0)}
                />
              </Flex>
            </Card>
          );
        })}
      </div>
    </Flex>
  );
}
