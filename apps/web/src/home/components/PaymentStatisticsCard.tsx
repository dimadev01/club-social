import { DueCategoryLabel, DueCategorySorted } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { Flex, Grid, Statistic, theme, Typography } from 'antd';

import { DueCategoryIconMap } from '@/dues/DueCategoryIconMap';
import { useDueCategoryColors } from '@/dues/useDueCategoryColors';
import { Card, PageHeading } from '@/ui';

import { usePaymentStatistics } from '../usePaymentStatistics';
import { HeroStatCard } from './HeroStatCard';

interface Props {
  dateRange?: [string, string];
}

export function PaymentStatisticsCard({ dateRange }: Props) {
  const { data: statistics, isLoading } = usePaymentStatistics({ dateRange });
  const { token } = theme.useToken();
  const { lg, md } = Grid.useBreakpoint();
  const categoryColor = useDueCategoryColors();

  return (
    <div>
      <PageHeading>Pagos</PageHeading>

      <Flex gap="middle" vertical>
        <HeroStatCard
          accentColor={token.colorWhite}
          background={`linear-gradient(135deg, ${token.colorPrimary}, ${token.colorSuccessActive})`}
          gap="large"
          label="Pagos realizados"
          loading={isLoading}
          rightSlot={
            <Flex gap={!lg ? 20 : 28} vertical={!md}>
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
                  key={label}
                  loading={isLoading}
                  styles={{
                    content: {
                      color: token.colorWhite,
                      fontSize: token.fontSizeXL,
                      textAlign: lg ? 'right' : 'left',
                    },
                    title: {
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: token.fontSizeSM,
                      textAlign: lg ? 'right' : 'left',
                    },
                  }}
                  title={label}
                  value={
                    format === 'currency'
                      ? NumberFormat.currencyCents(value)
                      : value
                  }
                />
              ))}
            </Flex>
          }
          showBorder
          subtitle="Actividad de pagos registrada en el período seleccionado"
          subtitleColor="rgba(255, 255, 255, 0.75)"
          value={statistics?.count ?? 0}
        />

        {/* Category cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {DueCategorySorted.map((category) => {
            const categoryData = statistics?.categories[category];
            const isEmpty = !categoryData || categoryData.count === 0;
            const color = categoryColor[category];

            return (
              <Card className="h-full" key={category}>
                <Flex gap="middle" vertical>
                  <Statistic
                    loading={isLoading}
                    styles={{
                      content: {
                        color: isEmpty ? token.colorTextDisabled : color,
                      },
                    }}
                    title={
                      <div className="space-x-1">
                        <span
                          style={{
                            color: isEmpty ? token.colorTextDisabled : color,
                          }}
                        >
                          {DueCategoryIconMap[category]}
                        </span>
                        <Typography.Text strong type="secondary">
                          {DueCategoryLabel[category]} (
                          {categoryData?.count ?? 0})
                        </Typography.Text>
                      </div>
                    }
                    value={NumberFormat.currencyCents(
                      categoryData?.amount ?? 0,
                    )}
                  />
                </Flex>
              </Card>
            );
          })}
        </div>
      </Flex>
    </div>
  );
}
