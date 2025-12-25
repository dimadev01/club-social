import type { Dayjs } from 'dayjs';

import { Space } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

import { Page } from '@/ui/Page';

import { DuePendingStatisticsCard } from './components/DuePendingStatisticsCard';
import { MovementStatisticsCard } from './components/MovementStatisticsCard';
import { PaymentStatisticsCard } from './components/PaymentStatisticsCard';
import { StatisticsFilters } from './components/StatisticsFilters';

export function Home() {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([
    dayjs().startOf('month'),
    dayjs(),
  ]);

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
        <PaymentStatisticsCard dateRange={dateRange} />
        <MovementStatisticsCard dateRange={dateRange} />
        <DuePendingStatisticsCard />
      </Space>
    </Page>
  );
}
