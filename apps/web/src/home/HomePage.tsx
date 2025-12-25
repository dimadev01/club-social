import type { Dayjs } from 'dayjs';

import { DueCategory } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { Space, Statistic } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

import { DateFormat } from '@/shared/lib/date-format';
import { Card } from '@/ui/Card';
import { Page } from '@/ui/Page';

import { DueCategoryDescriptions } from './components/DueCategoryDescriptions';
import { StatisticsFilters } from './components/StatisticsFilters';
import { usePaymentStatistics } from './usePaymentStatistics';

export function Home() {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([
    dayjs().startOf('month'),
    dayjs(),
  ]);

  const { data: statistics, isLoading } = usePaymentStatistics({
    dateRange: dateRange
      ? [DateFormat.isoDate(dateRange[0]), DateFormat.isoDate(dateRange[1])]
      : undefined,
  });

  return (
    <Page
      extra={
        <StatisticsFilters
          onChange={(dates) => setDateRange(dates)}
          value={dateRange ?? undefined}
        />
      }
      title="Balance"
    >
      <Space className="flex" vertical>
        <Card
          loading={isLoading}
          size="small"
          title="Pagos en el período"
          type="inner"
        >
          <Card.Grid className="w-full md:w-1/3">
            <Statistic title="Cantidad" value={statistics?.count} />
          </Card.Grid>
          <Card.Grid className="w-full md:w-1/3">
            <Statistic
              title="Total"
              value={NumberFormat.formatCurrencyCents(statistics?.total ?? 0)}
            />
          </Card.Grid>
          <Card.Grid className="w-full md:w-1/3">
            <Statistic
              title="Promedio"
              value={NumberFormat.formatCurrencyCents(statistics?.average ?? 0)}
            />
          </Card.Grid>

          <Card.Grid className="w-full md:w-1/3">
            <DueCategoryDescriptions
              category={DueCategory.MEMBERSHIP}
              data={statistics}
            />
          </Card.Grid>

          <Card.Grid className="w-full md:w-1/3">
            <DueCategoryDescriptions
              category={DueCategory.ELECTRICITY}
              data={statistics}
            />
          </Card.Grid>

          <Card.Grid className="w-full md:w-1/3">
            <DueCategoryDescriptions
              category={DueCategory.GUEST}
              data={statistics}
            />
          </Card.Grid>
        </Card>
      </Space>
    </Page>
  );
}
