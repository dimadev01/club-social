import { DateFormat, DateFormats, NumberFormat } from '@club-social/shared/lib';
import { Empty, theme } from 'antd';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useMovementMonthlyTrend } from '@/home/useMovementMonthlyTrend';
import { Card, PageHeading } from '@/ui';

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadItem[];
}

interface TooltipPayloadItem {
  color: string;
  name: string;
  value: number;
}

export function RevenueTrendCard() {
  const { data, isLoading } = useMovementMonthlyTrend({ months: 12 });
  const { token } = theme.useToken();

  const hasData = (data?.months.length ?? 0) > 0;

  return (
    <div>
      <PageHeading>Tendencia mensual (últimos 12 meses)</PageHeading>

      <Card loading={isLoading}>
        {!isLoading && !hasData && (
          <div className="flex h-64 items-center justify-center">
            <Empty description="Sin movimientos registrados" />
          </div>
        )}

        {hasData && (
          <div className="h-72">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart
                data={data?.months}
                margin={{ bottom: 0, left: 0, right: 10, top: 10 }}
              >
                <defs>
                  <linearGradient
                    id="inflowGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={token.colorSuccess}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={token.colorSuccess}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="outflowGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={token.colorError}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={token.colorError}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke={token.colorBorderSecondary}
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  fontSize={12}
                  stroke={token.colorTextSecondary}
                  tickFormatter={(value: string) =>
                    DateFormat.parse(`${value}-01`).format('MMM')
                  }
                  tickLine={false}
                />

                <YAxis
                  fontSize={12}
                  stroke={token.colorTextSecondary}
                  tickFormatter={(value: number) =>
                    NumberFormat.currencyCents(Math.abs(value))
                  }
                  tickLine={false}
                  width={80}
                />

                <Tooltip content={<CustomTooltip />} />

                <Legend
                  formatter={(value) => (
                    <span style={{ color: token.colorText, fontSize: 12 }}>
                      {value}
                    </span>
                  )}
                />

                <Area
                  dataKey="totalInflow"
                  fill="url(#inflowGradient)"
                  name="Ingresos"
                  stroke={token.colorSuccess}
                  strokeWidth={2}
                  type="monotone"
                />

                <Area
                  dataKey="totalOutflow"
                  fill="url(#outflowGradient)"
                  name="Egresos"
                  stroke={token.colorError}
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

function CustomTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload?.length || !label) {
    return null;
  }

  const monthLabel = DateFormat.parse(`${label}-01`).format(
    DateFormats.monthYear,
  );

  return (
    <Card size="small" title={monthLabel}>
      <div className="flex flex-col gap-1 text-sm">
        {payload.map((item) => (
          <div className="flex items-center gap-2" key={item.name}>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-500">{item.name}:</span>
            <span className="font-medium">
              {NumberFormat.currencyCents(Math.abs(item.value))}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
