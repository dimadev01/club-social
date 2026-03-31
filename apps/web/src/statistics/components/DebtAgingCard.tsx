import { orange } from '@ant-design/colors';
import { NumberFormat } from '@club-social/shared/lib';
import { Empty, theme } from 'antd';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useDueAging } from '@/home/useDueAging';
import { Card, PageHeading } from '@/ui';

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

interface DebtAgingCardProps {
  dateRange?: [string, string];
}

interface TooltipPayloadItem {
  color: string;
  name: string;
  payload: { amount: number; count: number; label: string; percentage: number };
  value: number;
}

export function DebtAgingCard({ dateRange }: DebtAgingCardProps) {
  const { data, isLoading } = useDueAging({ dateRange });
  const { token } = theme.useToken();

  const barColors = [
    token.colorSuccess,
    token.colorWarning,
    orange[5],
    token.colorError,
  ];

  const chartData =
    data?.brackets.map((bracket, index) => ({
      ...bracket,
      fill: barColors[index % barColors.length],
    })) ?? [];

  const hasData = chartData.some((b) => b.count > 0);

  return (
    <div>
      <PageHeading>Antigüedad de deuda</PageHeading>
      <Card loading={isLoading}>
        {!isLoading && !data && (
          <div className="flex h-56 items-center justify-center">
            <Empty description="Sin datos disponibles" />
          </div>
        )}

        {!isLoading && data && !hasData && (
          <div className="flex h-56 items-center justify-center">
            <Empty description="Sin deudas pendientes" />
          </div>
        )}

        {hasData && (
          <div className="h-56">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ bottom: 0, left: 0, right: 16, top: 0 }}
              >
                <XAxis
                  axisLine={false}
                  fontSize={12}
                  stroke={token.colorTextSecondary}
                  tickFormatter={(value: number) =>
                    NumberFormat.currencyCents(value)
                  }
                  tickLine={false}
                  type="number"
                />
                <YAxis
                  dataKey="label"
                  fontSize={12}
                  stroke={token.colorTextSecondary}
                  tickLine={false}
                  type="category"
                  width={40}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: token.colorFillSecondary }}
                />
                <Bar dataKey="amount" maxBarSize={24} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const { amount, count, label, percentage } = payload[0].payload;

  return (
    <Card size="small" title={`${label} días`}>
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Cuotas:</span>
          <span className="font-medium">{count}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Monto:</span>
          <span className="font-medium">
            {NumberFormat.currencyCents(amount)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Del total:</span>
          <span className="font-medium">{percentage}%</span>
        </div>
      </div>
    </Card>
  );
}
