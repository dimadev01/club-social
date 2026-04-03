import { NumberFormat } from '@club-social/shared/lib';
import {
  MovementCategoryLabel,
  MovementType,
} from '@club-social/shared/movements';
import { Alert, Button, Empty, theme } from 'antd';
import { useMemo } from 'react';
import {
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { useMovementByCategory } from '@/home/useMovementByCategory';
import { CHART_COLORS } from '@/statistics/chartColors';
import { Card, Descriptions } from '@/ui';

const TOP_N = 5;

interface ChartDataItem {
  amount: number;
  fill: string;
  name: string;
  percentage: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

interface Props {
  dateRange?: [string, string];
  type: MovementType;
}

interface TooltipPayloadItem {
  payload: { amount: number; name: string; percentage: number };
}

export function CategoryDonutChart({ dateRange, type }: Props) {
  const { token } = theme.useToken();

  const { data, isError, isLoading, refetch } = useMovementByCategory({
    dateRange,
    type,
  });

  const total = data?.total ?? 0;

  const chartData = useMemo<ChartDataItem[]>(() => {
    if (!data?.categories.length) return [];

    const top = data.categories.slice(0, TOP_N);
    const rest = data.categories.slice(TOP_N);

    const items = top.map((category, index) => ({
      amount: category.amount,
      fill: CHART_COLORS[index % CHART_COLORS.length],
      name: MovementCategoryLabel[category.category],
      percentage: category.percentage,
    }));

    if (rest.length > 0) {
      const othersAmount = rest.reduce(
        (sum, category) => sum + category.amount,
        0,
      );
      items.push({
        amount: othersAmount,
        fill: CHART_COLORS[top.length % CHART_COLORS.length],
        name: `Otros (${rest.length})`,
        percentage: toPercentage(othersAmount, total),
      });
    }

    return items;
  }, [data, total]);

  const hasData = chartData.length > 0;

  return (
    <div>
      {isLoading && (
        <div
          className="h-64"
          style={{
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
          }}
        />
      )}

      {!isLoading && isError && (
        <div className="flex h-64 items-center justify-center">
          <Alert
            action={
              <Button
                onClick={() => void refetch()}
                size="small"
                type="primary"
              >
                Reintentar
              </Button>
            }
            message="No se pudieron cargar los datos"
            showIcon
            type="error"
          />
        </div>
      )}

      {!isLoading && !isError && !hasData && (
        <div className="flex h-64 items-center justify-center">
          <Empty
            description={`Sin ${type === MovementType.OUTFLOW ? 'egresos' : 'ingresos'} registrados`}
          />
        </div>
      )}

      {!isLoading && !isError && hasData && (
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
              >
                <Label
                  dy={-8}
                  fill={token.colorText}
                  fontSize={13}
                  fontWeight={700}
                  position="center"
                  value={NumberFormat.currencyCents(total)}
                />
                <Label
                  dy={10}
                  fill={token.colorTextSecondary}
                  fontSize={10}
                  position="center"
                  value="total"
                />
              </Pie>

              <Tooltip content={<CustomTooltip />} cursor={false} />

              <Legend
                formatter={(value) => (
                  <span
                    style={{
                      color: token.colorText,
                      fontSize: token.fontSizeSM,
                    }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { amount, name, percentage } = payload[0].payload;

  return (
    <Card size="small" title={name}>
      <Descriptions
        bordered={false}
        className="max-w-44"
        items={[
          {
            children: NumberFormat.currencyCents(amount),
            label: 'Monto',
          },
          {
            children: `${percentage}%`,
            label: 'Del total',
          },
        ]}
      />
    </Card>
  );
}

function toPercentage(amount: number, total: number) {
  if (total === 0) return 0;

  return Math.round((amount / total) * 10000) / 100;
}
