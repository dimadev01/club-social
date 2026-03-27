import type { Dayjs } from 'dayjs';

import { DateFormat, DateFormats } from '@club-social/shared/lib';
import { Space } from 'antd';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { DuePendingStatisticsCard } from '@/home/components/DuePendingStatisticsCard';
import { MovementStatisticsCard } from '@/home/components/MovementStatisticsCard';
import { PaymentChartCard } from '@/home/components/PaymentChartCard';
import { PaymentStatisticsCard } from '@/home/components/PaymentStatisticsCard';
import {
  DatePicker,
  Form,
  getPresets,
  Page,
  PageHeader,
  PageTitle,
} from '@/ui';

import { CollectionRateCard } from './components/CollectionRateCard';
import { DebtAgingCard } from './components/DebtAgingCard';
import { ExpenseCategoryChart } from './components/ExpenseCategoryChart';
import { IncomeCategoryChart } from './components/IncomeCategoryChart';
import { RevenueTrendChart } from './components/RevenueTrendChart';

export function FinanceStatisticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const dayjsRange = useMemo<[Dayjs, Dayjs] | null>(() => {
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (startDate === '') return null;

    if (startDate && endDate) {
      const start = DateFormat.parse(startDate);
      const end = DateFormat.parse(endDate);

      if (start.isValid() && end.isValid()) {
        return [start, end];
      }
    }

    // First visit — default to current month
    return [
      DateFormat.parse(DateFormat.today()).startOf('month'),
      DateFormat.parse(DateFormat.today()),
    ];
  }, [searchParams]);

  const dateRange = useMemo<[string, string] | undefined>(() => {
    if (!dayjsRange) return undefined;

    return [
      DateFormat.isoDate(dayjsRange[0]),
      DateFormat.isoDate(dayjsRange[1]),
    ];
  }, [dayjsRange]);

  const setDateRange = useCallback(
    (dates: [Dayjs, Dayjs] | null) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        if (dates) {
          newParams.set('startDate', DateFormat.isoDate(dates[0]));
          newParams.set('endDate', DateFormat.isoDate(dates[1]));
        } else {
          newParams.set('startDate', '');
          newParams.delete('endDate');
        }

        return newParams;
      });
    },
    [setSearchParams],
  );

  return (
    <Page>
      <PageHeader>
        <PageTitle>Estadísticas de Finanzas</PageTitle>
      </PageHeader>
      <Space className="flex" vertical>
        <Form.Item label="Período de tiempo">
          <DatePicker.RangePicker
            format={DateFormats.date}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                const [start, end] = dates;
                setDateRange([start.startOf('day'), end.startOf('day')]);
              } else {
                setDateRange(null);
              }
            }}
            placeholder={['Fecha desde', 'Fecha hasta']}
            presets={getPresets()}
            value={dayjsRange ?? undefined}
          />
        </Form.Item>
        <PaymentStatisticsCard dateRange={dateRange} />
        <MovementStatisticsCard dateRange={dateRange} />
        <DuePendingStatisticsCard dateRange={dateRange} />
        <RevenueTrendChart />
        <CollectionRateCard dateRange={dateRange} />
        <DebtAgingCard />
        <ExpenseCategoryChart dateRange={dateRange} />
        <IncomeCategoryChart dateRange={dateRange} />
        <PaymentChartCard />
      </Space>
    </Page>
  );
}
