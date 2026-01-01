import type { Dayjs } from 'dayjs';

import { Space } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

import { Page } from '@/ui/Page';

import { DuePendingStatisticsCard } from './components/DuePendingStatisticsCard';
import { MovementStatisticsCard } from './components/MovementStatisticsCard';
import { PaymentChartCard } from './components/PaymentChartCard';
import { PaymentStatisticsCard } from './components/PaymentStatisticsCard';
import { StatisticsFilters } from './components/StatisticsFilters';

export function Home() {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([
    dayjs().startOf('month'),
    dayjs(),
  ]);

  return (
    <Page
      classNames={{
        header:
          '[&>.ant-card-head-wrapper]:flex-wrap [&>.ant-card-head-wrapper]:gap-2 [&>.ant-card-head-wrapper]:py-2',
      }}
      extra={
        <StatisticsFilters
          onChange={(dates) => setDateRange(dates)}
          value={dateRange ?? undefined}
        />
      }
      title="Balance"
    >
      <Space className="flex" vertical>
        <PaymentChartCard />
        <PaymentStatisticsCard dateRange={dateRange} />
        <MovementStatisticsCard dateRange={dateRange} />
        <DuePendingStatisticsCard dateRange={dateRange} />
      </Space>
    </Page>
  );
}
