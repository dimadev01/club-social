import { NumberFormat } from '@club-social/shared/lib';
import {
  MovementCategoryLabel,
  MovementType,
} from '@club-social/shared/movements';
import { Empty, theme, Typography } from 'antd';
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

const TOP_N = 5;

interface CenterLabelProps {
  colorText: string;
  colorTextSecondary: string;
  total: number;
  viewBox?: { cx: number; cy: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

interface Props {
  dateRange?: [string, string];
  title: string;
  type: MovementType;
}

interface TooltipPayloadItem {
  payload: { amount: number; name: string; percentage: number };
}

export function CategoryDonutChart({ dateRange, title, type }: Props) {
  const { token } = theme.useToken();

  const { data, isLoading } = useMovementByCategory({ dateRange, type });

  const colors = [
    token.colorPrimary,
    token.colorSuccess,
    token.colorWarning,
    token.colorError,
    token.colorInfo,
    token.colorTextSecondary,
  ];

  const { chartData, total } = useMemo(() => {
    if (!data?.categories.length) return { chartData: [], total: 0 };

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
        name: `Otros (${rest.length})`,
        percentage: othersPercentage,
      });
    }

    const computedTotal = data.categories.reduce((sum, c) => sum + c.amount, 0);

    return { chartData: items, total: computedTotal };
  }, [data, token, colors]);

  const hasData = chartData.length > 0;

  return (
    <div>
      <Typography.Text
        strong
        style={{ color: token.colorText, display: 'block', marginBottom: 12 }}
      >
        {title}
      </Typography.Text>

      {isLoading && (
        <div
          className="h-64"
          style={{
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
          }}
        />
      )}

      {!isLoading && !hasData && (
        <div className="flex h-64 items-center justify-center">
          <Empty
            description={`Sin ${type === MovementType.OUTFLOW ? 'egresos' : 'ingresos'} registrados`}
          />
        </div>
      )}

      {!isLoading && hasData && (
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
                  content={(props) => (
                    <CenterLabel
                      colorText={token.colorText}
                      colorTextSecondary={token.colorTextSecondary}
                      total={total}
                      viewBox={props.viewBox as { cx: number; cy: number }}
                    />
                  )}
                  position="center"
                />
              </Pie>
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
    </div>
  );
}

function CenterLabel({
  colorText,
  colorTextSecondary,
  total,
  viewBox,
}: CenterLabelProps) {
  if (!viewBox) return null;
  const { cx, cy } = viewBox;

  return (
    <>
      <text
        dominantBaseline="middle"
        fill={colorText}
        style={{ fontSize: 13, fontWeight: 700 }}
        textAnchor="middle"
        x={cx}
        y={cy - 8}
      >
        {NumberFormat.currencyCents(total)}
      </text>
      <text
        dominantBaseline="middle"
        fill={colorTextSecondary}
        style={{ fontSize: 10 }}
        textAnchor="middle"
        x={cx}
        y={cy + 10}
      >
        total
      </text>
    </>
  );
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { amount, name, percentage } = payload[0].payload;

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        fontSize: 13,
        padding: '8px 12px',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{name}</div>
      <div
        style={{ display: 'flex', gap: 16, justifyContent: 'space-between' }}
      >
        <span style={{ color: '#888' }}>Monto:</span>
        <span style={{ fontWeight: 500 }}>
          {NumberFormat.currencyCents(amount)}
        </span>
      </div>
      <div
        style={{ display: 'flex', gap: 16, justifyContent: 'space-between' }}
      >
        <span style={{ color: '#888' }}>Del total:</span>
        <span style={{ fontWeight: 500 }}>{percentage}%</span>
      </div>
    </div>
  );
}
