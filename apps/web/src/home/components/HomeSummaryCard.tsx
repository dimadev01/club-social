import {
  DollarOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { NumberFormat } from '@club-social/shared/lib';
import { MemberCategoryLabel } from '@club-social/shared/members';
import { Col, Row, Statistic, Table, Typography } from 'antd';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMemberStatistics } from '@/statistics';
import { Card } from '@/ui';

import { useMovementStatistics } from '../useMovementStatistics';

export function HomeSummaryCard() {
  const { data: movementStats, isLoading: movementLoading } =
    useMovementStatistics({});
  const { data: memberStats, isLoading: memberLoading } = useMemberStatistics({
    limit: 5,
  });

  return (
    <Card title="Resumen">
      <Row gutter={[24, 24]}>
        <Col lg={8} md={12} xs={24}>
          <Statistic
            loading={movementLoading}
            prefix={<DollarOutlined />}
            title="Total acumulado"
            value={NumberFormat.currencyCents(movementStats?.total ?? 0)}
          />
        </Col>
        <Col lg={8} md={12} xs={24}>
          <Statistic
            loading={memberLoading}
            prefix={<TeamOutlined />}
            title="Socios activos"
            value={memberStats?.total ?? 0}
          />
        </Col>
        <Col lg={8} xs={24}>
          <Typography.Text strong>
            <WarningOutlined /> Top 5 deudores
          </Typography.Text>
          <Table
            columns={[
              {
                dataIndex: 'name',
                ellipsis: true,
                render: (name: string, record) => (
                  <Link to={appRoutes.members.view(record.id)}>{name}</Link>
                ),
                title: 'Socio',
              },
              {
                align: 'right',
                dataIndex: 'totalDebt',
                render: (debt: number) => NumberFormat.currencyCents(debt),
                title: 'Deuda',
              },
            ]}
            dataSource={memberStats?.topDebtors.map((d) => ({
              ...d,
              categoryLabel: MemberCategoryLabel[d.category],
              key: d.id,
            }))}
            loading={memberLoading}
            pagination={false}
            size="small"
          />
        </Col>
      </Row>
    </Card>
  );
}
