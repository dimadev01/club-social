import { NumberFormat } from '@club-social/shared/lib';
import {
  MovementCategoryLabel,
  MovementType,
} from '@club-social/shared/movements';
import { Empty, theme } from 'antd';
import { useMemo } from 'react';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { useMovementByCategory } from '@/home/useMovementByCategory';
import { Card } from '@/ui';

const TOP_N = 5;

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

interface Props {
  dateRange?: [string, string];
}

interface TooltipPayloadItem {
  payload: { amount: number; name: string; percentage: number };
}

export function ExpenseCategoryChart({ dateRange }: Props) {
  const { token } = theme.useToken();

  const { data, isLoading } = useMovementByCategory({
    dateRange,
    type: MovementType.OUTFLOW,
  });

  const chartData = useMemo(() => {
    const colors = [
      token.colorPrimary,
      token.colorSuccess,
      token.colorWarning,
      token.colorError,
      token.colorInfo,
      token.colorTextSecondary,
    ];

    if (!data?.categories.length) return [];

    const top = data.categories.slice(0, TOP_N);
    const rest = data.categories.slice(TOP_N);

    const items = top.map((c, index) => ({
      amount: c.amount,
      fill: colors[index % colors.length],
      name:
        MovementCategoryLabel[
          c.category as keyof typeof MovementCategoryLabel
        ] ?? c.category,
      percentage: c.percentage,
    }));

    if (rest.length > 0) {
      const othersAmount = rest.reduce((sum, c) => sum + c.amount, 0);
      const othersPercentage = rest.reduce((sum, c) => sum + c.percentage, 0);
      items.push({
        amount: othersAmount,
        fill: colors[top.length % colors.length],
        name: 'Otros',
        percentage: othersPercentage,
      });
    }

    return items;
  }, [data, token]);

  const hasData = chartData.length > 0;

  return (
    <Card loading={isLoading} title="Egresos por categoría">
      {!isLoading && !hasData && (
        <div className="flex h-64 items-center justify-center">
          <Empty description="Sin egresos registrados" />
        </div>
      )}

      {hasData && (
        <div className="h-64">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={chartData}
                dataKey="amount"
                innerRadius="55%"
                nameKey="name"
                outerRadius="80%"
                paddingAngle={2}
                stroke="none"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: token.colorText, fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const { amount, name, percentage } = payload[0].payload;

  return (
    <Card size="small" title={name}>
      <div className="flex flex-col gap-1 text-sm">
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
