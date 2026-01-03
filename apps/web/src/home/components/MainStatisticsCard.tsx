import type { Dayjs } from 'dayjs';

import { Space } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

import { Card, Form } from '@/ui';

import { DuePendingStatisticsCard } from './DuePendingStatisticsCard';
import { MovementStatisticsCard } from './MovementStatisticsCard';
import { PaymentStatisticsCard } from './PaymentStatisticsCard';
import { StatisticsFilters } from './StatisticsFilters';

export function MainStatisticsCard() {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([
    dayjs().startOf('month'),
    dayjs(),
  ]);

  return (
    <Card title="Balance">
      <Form.Item label="Período de tiempo">
        <StatisticsFilters
          onChange={(dates) => setDateRange(dates)}
          value={dateRange ?? undefined}
        />
      </Form.Item>
      <Space className="flex" vertical>
        <PaymentStatisticsCard dateRange={dateRange} />
        <MovementStatisticsCard dateRange={dateRange} />
        <DuePendingStatisticsCard dateRange={dateRange} />
      </Space>
    </Card>
  );
}
