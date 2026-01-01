import type { PaymentDailyStatisticsItemDto } from '@club-social/shared/payments';

import { NumberFormat } from '@club-social/shared/lib';
import { DatePicker, Empty, Spin, theme } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card } from '@/ui/Card';
import { PaymentsIcon } from '@/ui/Icons/PaymentsIcon';

import { usePaymentDailyStatistics } from '../usePaymentDailyStatistics';

interface ChartDataItem {
  amount: number;
  count: number;
  date: string;
  day: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: ChartDataItem }[];
}

export function PaymentChartCard() {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const { token } = theme.useToken();

  const monthStr = selectedMonth.format('YYYY-MM');

  const { data: statistics, isLoading } = usePaymentDailyStatistics({
    month: monthStr,
  });

  const days = statistics?.days;
  const chartData = useMemo(() => {
    if (!days) return [];

    return transformData(days, monthStr);
  }, [days, monthStr]);

  const hasData = chartData.some((d) => d.amount > 0);

  return (
    <Card
      extra={<PaymentsIcon />}
      size="small"
      title={
        <div className="flex items-center gap-3">
          <span>Pagos por día</span>
          <DatePicker
            allowClear={false}
            onChange={(date) => date && setSelectedMonth(date)}
            picker="month"
            size="small"
            value={selectedMonth}
          />
        </div>
      }
      type="inner"
    >
      <div className="h-64 w-full">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spin />
          </div>
        ) : !hasData ? (
          <div className="flex h-full items-center justify-center">
            <Empty description="Sin pagos en este mes" />
          </div>
        ) : (
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              data={chartData}
              margin={{ bottom: 0, left: 0, right: 10, top: 10 }}
            >
              <CartesianGrid
                stroke={token.colorBorderSecondary}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                fontSize={12}
                stroke={token.colorTextSecondary}
                tickLine={false}
              />
              <YAxis
                fontSize={12}
                stroke={token.colorTextSecondary}
                tickFormatter={(value: number) =>
                  NumberFormat.formatCurrencyCents(value)
                }
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                fill={token.colorPrimary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-1 font-medium">
        {dayjs(data.date).format('D [de] MMMM')}
      </p>
      <p className="text-sm">
        <span className="text-gray-500 dark:text-gray-400">Monto: </span>
        <span className="font-medium">
          {NumberFormat.formatCurrencyCents(data.amount)}
        </span>
      </p>
      <p className="text-sm">
        <span className="text-gray-500 dark:text-gray-400">Pagos: </span>
        <span className="font-medium">{data.count}</span>
      </p>
    </div>
  );
}

function transformData(
  days: PaymentDailyStatisticsItemDto[],
  month: string,
): ChartDataItem[] {
  const [year, monthNum] = month.split('-').map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();

  const dataMap = new Map(days.map((d) => [d.date, d]));

  const result: ChartDataItem[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${month}-${String(day).padStart(2, '0')}`;
    const data = dataMap.get(dateStr);

    result.push({
      amount: data?.amount ?? 0,
      count: data?.count ?? 0,
      date: dateStr,
      day,
    });
  }

  return result;
}
