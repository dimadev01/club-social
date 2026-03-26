import { NumberFormat } from '@club-social/shared/lib';
import { Empty, theme } from 'antd';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useDueAging } from '@/home/useDueAging';
import { Card } from '@/ui';

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

interface TooltipPayloadItem {
  color: string;
  name: string;
  payload: { amount: number; count: number; label: string; percentage: number };
  value: number;
}

export function DebtAgingCard() {
  const { data, isLoading } = useDueAging();
  const { token } = theme.useToken();

  const barColors = [
    token.colorSuccess,
    token.colorWarning,
    '#fa8c16',
    token.colorError,
  ];

  const hasData = data?.brackets.some((b) => b.count > 0) ?? false;

  return (
    <Card loading={isLoading} title="Antigüedad de deuda">
      {!isLoading && !data && (
        <div className="flex h-48 items-center justify-center">
          <Empty description="Sin datos disponibles" />
        </div>
      )}
      {!isLoading && data && !hasData && (
        <div className="flex h-48 items-center justify-center">
          <Empty description="Sin deudas pendientes" />
        </div>
      )}

      {hasData && (
        <div className="h-48">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              data={data?.brackets}
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
                tickFormatter={(value: string) => `${value}d`}
                tickLine={false}
                type="category"
                width={40}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: token.colorFillSecondary }}
              />
              <Bar dataKey="amount" maxBarSize={24} radius={[0, 4, 4, 0]}>
                {data?.brackets.map((_, index) => (
                  <Cell
                    fill={barColors[index % barColors.length]}
                    key={index}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
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
