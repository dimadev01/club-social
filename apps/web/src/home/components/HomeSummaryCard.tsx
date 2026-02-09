import { TeamOutlined } from '@ant-design/icons';
import { NumberFormat } from '@club-social/shared/lib';
import { MemberCategoryLabel } from '@club-social/shared/members';
import { Col, Space, Statistic } from 'antd';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMemberStatistics } from '@/statistics';
import {
  Button,
  Card,
  DuesIcon,
  PaymentsIcon,
  Row,
  Table,
  TABLE_COLUMN_WIDTHS,
} from '@/ui';

import { useMovementStatistics } from '../useMovementStatistics';

export function HomeSummaryCard() {
  const { data: movementStats, isLoading: movementLoading } =
    useMovementStatistics({});

  const { data: memberStats, isLoading: memberLoading } = useMemberStatistics({
    limit: 5,
  });

  return (
    <Card title="Resumen">
      <Row>
        <Col md={12} xl={8} xs={24}>
          <Statistic
            loading={movementLoading}
            title="Caja acumulada"
            value={NumberFormat.currencyCents(movementStats?.total ?? 0)}
          />
        </Col>
        <Col md={12} xl={8} xs={24}>
          <Statistic
            loading={memberLoading}
            prefix={<TeamOutlined />}
            title="Socios activos"
            value={memberStats?.total ?? 0}
          />
        </Col>
        <Col xl={8} xs={24}>
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
            dataSource={memberStats?.topDebtors.map((d) => ({
              ...d,
              categoryLabel: MemberCategoryLabel[d.category],
              key: d.id,
            }))}
            loading={memberLoading}
            pagination={false}
            size="small"
            title={() => 'Top 5 deudores'}
          />
        </Col>
      </Row>
    </Card>
  );
}
