import type { Dayjs } from 'dayjs';

import { DateFormat } from '@club-social/shared/lib';
import { Space } from 'antd';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { Card, Form } from '@/ui';

import { DuePendingStatisticsCard } from './DuePendingStatisticsCard';
import { MovementStatisticsCard } from './MovementStatisticsCard';
import { PaymentStatisticsCard } from './PaymentStatisticsCard';
import { StatisticsFilters } from './StatisticsFilters';

export function MainStatisticsCard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const dateRange = useMemo<[Dayjs, Dayjs] | null>(() => {
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Explicitly cleared (empty string marker)
    if (startDate === '') {
      return null;
    }

    // Has valid dates in URL
    if (startDate && endDate) {
      const start = DateFormat.parse(startDate);
      const end = DateFormat.parse(endDate);

      if (start.isValid() && end.isValid()) {
        return [start, end];
      }
    }

    // First visit (no params) → default to current month
    return [
      DateFormat.parse(DateFormat.today()).startOf('month'),
      DateFormat.parse(DateFormat.today()),
    ];
  }, [searchParams]);

  const setDateRange = useCallback(
    (dates: [Dayjs, Dayjs] | null) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        if (dates) {
          newParams.set('startDate', DateFormat.isoDate(dates[0]));
          newParams.set('endDate', DateFormat.isoDate(dates[1]));
        } else {
          // Mark as explicitly cleared with empty string
          newParams.set('startDate', '');
          newParams.delete('endDate');
        }

        return newParams;
      });
    },
    [setSearchParams],
  );

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
