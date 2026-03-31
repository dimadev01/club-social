import type { Dayjs } from 'dayjs';

import { DateFormat, DateFormats } from '@club-social/shared/lib';
import { MovementType } from '@club-social/shared/movements';
import { Flex } from 'antd';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { DuePendingStatisticsCard } from '@/home/components/DuePendingStatisticsCard';
import { MovementStatisticsCard } from '@/home/components/MovementStatisticsCard';
import { PaymentChartCard } from '@/home/components/PaymentChartCard';
import { PaymentStatisticsCard } from '@/home/components/PaymentStatisticsCard';
import {
  Card,
  DatePicker,
  Form,
  getPresets,
  Page,
  PageHeader,
  PageHeading,
  PageTitle,
} from '@/ui';

import { CategoryDonutChart } from './components/CategoryDonutChart';
import { DebtAgingCard } from './components/DebtAgingCard';
import { RevenueTrendCard } from './components/RevenueTrendCard';

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
        <Form>
          <Form.Item className="mb-0" label="Período">
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
        </Form>
      </PageHeader>

      <Flex gap="large" vertical>
        <PaymentStatisticsCard dateRange={dateRange} />
        <MovementStatisticsCard dateRange={dateRange} />
        <DuePendingStatisticsCard dateRange={dateRange} />
        <RevenueTrendCard />
        <DebtAgingCard dateRange={dateRange} />
        <div>
          <PageHeading>Movimientos por categoría</PageHeading>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card title="Ingresos">
              <CategoryDonutChart
                dateRange={dateRange}
                type={MovementType.INFLOW}
              />
            </Card>
            <Card title="Egresos">
              <CategoryDonutChart
                dateRange={dateRange}
                type={MovementType.OUTFLOW}
              />
            </Card>
          </div>
        </div>
        <PaymentChartCard />
      </Flex>
    </Page>
  );
}
