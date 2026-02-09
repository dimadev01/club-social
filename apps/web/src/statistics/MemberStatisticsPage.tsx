import { NumberFormat } from '@club-social/shared/lib';
import {
  MemberCategory,
  MemberCategoryLabel,
  MemberCategorySort,
} from '@club-social/shared/members';
import { Col, Space, Statistic, theme } from 'antd';
import { useMemo } from 'react';
import { Link } from 'react-router';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { appRoutes } from '@/app/app.enum';
import {
  Button,
  Card,
  DuesIcon,
  Page,
  PaymentsIcon,
  Row,
  Table,
  TABLE_COLUMN_WIDTHS,
} from '@/ui';

import { useMemberStatistics } from './useMemberStatistics';

interface MembersByCategoryCardProps {
  data?: Record<MemberCategory, number>;
  isLoading: boolean;
  total: number;
}

interface MembersBySexCardProps {
  data?: { female: number; male: number; unknown: number };
  isLoading: boolean;
}

interface TopDebtorsCardProps {
  data: {
    category: MemberCategory;
    id: string;
    name: string;
    totalDebt: number;
  }[];
  isLoading: boolean;
}

export function MemberStatisticsPage() {
  const { data: statistics, isLoading } = useMemberStatistics({ limit: 10 });

  return (
    <Page>
      <Space className="flex" vertical>
        <MembersByCategoryCard
          data={statistics?.byCategory}
          isLoading={isLoading}
          total={statistics?.total ?? 0}
        />
        <MembersBySexCard data={statistics?.bySex} isLoading={isLoading} />
        <TopDebtorsCard
          data={statistics?.topDebtors ?? []}
          isLoading={isLoading}
        />
      </Space>
    </Page>
  );
}

function MembersByCategoryCard({
  data,
  isLoading,
  total,
}: MembersByCategoryCardProps) {
  const tableData = useMemo(() => {
    if (!data) {
      return [];
    }

    return Object.entries(data)
      .map(([category, count]) => ({
        category: category as MemberCategory,
        count,
        key: category,
      }))
      .sort(
        (a, b) =>
          MemberCategorySort[a.category] - MemberCategorySort[b.category],
      );
  }, [data]);

  return (
    <Card title="Socios por categoría">
      <Table
        columns={[
          {
            dataIndex: 'category',
            render: (category: MemberCategory) => MemberCategoryLabel[category],
            title: 'Categoría',
          },
          {
            align: 'right',
            dataIndex: 'count',
            title: 'Cantidad',
          },
        ]}
        dataSource={tableData}
        loading={isLoading}
        pagination={false}
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>
              <strong>Total</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell align="right" index={1}>
              <strong>{total}</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </Card>
  );
}

function MembersBySexCard({ data, isLoading }: MembersBySexCardProps) {
  const { token } = theme.useToken();

  const chartData = useMemo(() => {
    if (!data) {
      return [];
    }

    const items = [
      { fill: token.blue7, name: 'Masculino', value: data.male },
      { fill: token.magenta7, name: 'Femenino', value: data.female },
    ];

    if (data.unknown > 0) {
      items.push({
        fill: token.colorTextTertiary,
        name: 'Sin especificar',
        value: data.unknown,
      });
    }

    return items;
  }, [data, token]);

  const total = (data?.male ?? 0) + (data?.female ?? 0) + (data?.unknown ?? 0);

  return (
    <Card loading={isLoading} title="Socios por sexo">
      <Row>
        <Col lg={12} xs={24}>
          <div className="h-64">
            {total > 0 && (
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={chartData}
                    dataKey="value"
                    innerRadius={60}
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    outerRadius={100}
                    paddingAngle={2}
                  />
                  <Tooltip formatter={(value) => [value, 'Cantidad']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Col>
        <Col lg={12} xs={24}>
          <Space className="flex" size="large" vertical>
            <Statistic
              loading={isLoading}
              title="Masculino"
              value={data?.male ?? 0}
            />
            <Statistic
              loading={isLoading}
              title="Femenino"
              value={data?.female ?? 0}
            />
            {(data?.unknown ?? 0) > 0 && (
              <Statistic
                loading={isLoading}
                title="Sin especificar"
                value={data?.unknown ?? 0}
              />
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
}

function TopDebtorsCard({ data, isLoading }: TopDebtorsCardProps) {
  return (
    <Card title="Top 10 socios con mayor deuda">
      <Table
        columns={[
          {
            dataIndex: 'name',
            render: (name: string, record) => (
              <Link to={appRoutes.members.view(record.id)}>{name}</Link>
            ),
            title: 'Socio',
          },
          {
            align: 'center',
            dataIndex: 'category',
            render: (category: MemberCategory) => MemberCategoryLabel[category],
            title: 'Categoría',
            width: TABLE_COLUMN_WIDTHS.CATEGORY,
          },
          {
            align: 'right',
            dataIndex: 'totalDebt',
            render: (debt: number) => NumberFormat.currencyCents(debt),
            title: 'Deuda total',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
              <Space.Compact size="small">
                <Link
                  to={{
                    pathname: appRoutes.dues.list,
                    search: new URLSearchParams({
                      filters: `memberId:${record.id}`,
                    }).toString(),
                  }}
                >
                  <Button
                    icon={<DuesIcon />}
                    tooltip="Ver deudas"
                    type="text"
                  />
                </Link>
                <Link
                  to={{
                    pathname: appRoutes.payments.list,
                    search: new URLSearchParams({
                      filters: `memberId:${record.id}`,
                    }).toString(),
                  }}
                >
                  <Button
                    icon={<PaymentsIcon />}
                    tooltip="Ver pagos"
                    type="text"
                  />
                </Link>
              </Space.Compact>
            ),
            title: 'Acciones',
            width: TABLE_COLUMN_WIDTHS.ACTIONS,
          },
        ]}
        dataSource={data.map((item) => ({ ...item, key: item.id }))}
        loading={isLoading}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
