import type { PaymentDailyStatisticsItemDto } from '@club-social/shared/payments';

import { BarChartOutlined } from '@ant-design/icons';
import { DateFormat, DateFormats, NumberFormat } from '@club-social/shared/lib';
import { DatePicker, Empty, theme } from 'antd';
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

import { Card, Descriptions, Form } from '@/ui';

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
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(
    dayjs().subtract(1, 'month'),
  );
  const { token } = theme.useToken();

  const monthStr = selectedMonth.startOf('month').format(DateFormats.isoDate);

  const { data: statistics, isLoading } = usePaymentDailyStatistics({
    month: monthStr,
  });

  const days = statistics?.days;

  const chartData = useMemo(
    () => transformData(days ?? [], selectedMonth),
    [days, selectedMonth],
  );

  const hasData = chartData.some((d) => d.amount > 0);

  return (
    <Card
      extra={<BarChartOutlined />}
      loading={isLoading}
      title="Estadísticas de pagos"
    >
      <Form.Item label="Mes">
        <DatePicker
          allowClear={false}
          className="w-40"
          format={DateFormats.monthYear}
          onChange={(date) => date && setSelectedMonth(date)}
          picker="month"
          value={selectedMonth}
        />
      </Form.Item>

      <div className="h-64">
        {!hasData && (
          <div className="flex h-full items-center justify-center">
            <Empty description="Sin pagos en este mes" />
          </div>
        )}

        {hasData && (
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
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <Card
      size="small"
      title={DateFormat.parse(data.date).format('D [de] MMMM')}
    >
      <Descriptions
        bordered={false}
        className="max-w-32"
        items={[
          {
            children: data.count,
            label: 'Pagos',
          },
          {
            children: NumberFormat.formatCurrencyCents(data.amount),
            label: 'Total',
          },
        ]}
      />
    </Card>
  );
}

function transformData(
  stats: PaymentDailyStatisticsItemDto[],
  selectedDate: Dayjs,
): ChartDataItem[] {
  const daysInMonth = selectedDate.daysInMonth();

  // Data coming in the format YYYY-MM-DD
  const dataMap = new Map(stats.map((stat) => [stat.date, stat]));

  const result: ChartDataItem[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = selectedDate.set('date', day);

    const dateStr = date.format(DateFormats.isoDate);
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
