import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { NumberFormat } from '@club-social/shared/lib';
import {
  MemberCategory,
  MemberCategoryLabel,
  MemberCategorySort,
} from '@club-social/shared/members';
import { Col, Row, Space, Statistic, Table, theme } from 'antd';
import { useMemo } from 'react';
import { Link } from 'react-router';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { appRoutes } from '@/app/app.enum';
import { Card, Page } from '@/ui';

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
    if (!data) return [];

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
    <Card extra={<TeamOutlined />} title="Socios por categoría">
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <Table
            columns={[
              {
                dataIndex: 'category',
                render: (category: MemberCategory) =>
                  MemberCategoryLabel[category],
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
        </Col>
        <Col className="flex items-center justify-center" lg={12} xs={24}>
          <Statistic
            loading={isLoading}
            prefix={<TeamOutlined />}
            title="Total socios activos"
            value={total}
          />
        </Col>
      </Row>
    </Card>
  );
}

function MembersBySexCard({ data, isLoading }: MembersBySexCardProps) {
  const { token } = theme.useToken();

  const chartData = useMemo(() => {
    if (!data) return [];

    const items = [
      { color: token.blue6, name: 'Masculino', value: data.male },
      { color: token.magenta6, name: 'Femenino', value: data.female },
    ];

    if (data.unknown > 0) {
      items.push({
        color: token.colorTextQuaternary,
        name: 'Sin especificar',
        value: data.unknown,
      });
    }

    return items;
  }, [data, token]);

  const total = (data?.male ?? 0) + (data?.female ?? 0) + (data?.unknown ?? 0);

  return (
    <Card extra={<UserOutlined />} loading={isLoading} title="Socios por sexo">
      <Row gutter={[16, 16]}>
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
                  >
                    {chartData.map((entry) => (
                      <Cell fill={entry.color} key={entry.name} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Cantidad']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Col>
        <Col lg={12} xs={24}>
          <Space direction="vertical" size="large">
            <Statistic
              title="Masculino"
              value={data?.male ?? 0}
              valueStyle={{ color: token.blue6 }}
            />
            <Statistic
              title="Femenino"
              value={data?.female ?? 0}
              valueStyle={{ color: token.magenta6 }}
            />
            {(data?.unknown ?? 0) > 0 && (
              <Statistic
                title="Sin especificar"
                value={data?.unknown ?? 0}
                valueStyle={{ color: token.colorTextQuaternary }}
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
            dataIndex: 'category',
            render: (category: MemberCategory) => MemberCategoryLabel[category],
            title: 'Categoría',
          },
          {
            align: 'right',
            dataIndex: 'totalDebt',
            render: (debt: number) => NumberFormat.currencyCents(debt),
            title: 'Deuda total',
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
