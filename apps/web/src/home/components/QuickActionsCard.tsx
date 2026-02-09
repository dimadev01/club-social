import type { ReactNode } from 'react';

import { TeamOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Col, Flex, Row, theme, Typography } from 'antd';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { Card, DuesIcon, MovementsIcon, PaymentsIcon } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

interface QuickAction {
  icon: ReactNode;
  key: string;
  label: string;
  permission: boolean;
  to: string;
}

export function QuickActionsCard() {
  const permissions = usePermissions();
  const { token } = theme.useToken();

  const actions: QuickAction[] = [
    {
      icon: <DuesIcon />,
      key: 'due',
      label: 'Nueva deuda',
      permission: permissions.dues.create,
      to: appRoutes.dues.new,
    },
    {
      icon: <PaymentsIcon />,
      key: 'payment',
      label: 'Nuevo pago',
      permission: permissions.payments.create,
      to: appRoutes.payments.new,
    },
    {
      icon: <TeamOutlined />,
      key: 'member',
      label: 'Nuevo socio',
      permission: permissions.members.create,
      to: appRoutes.members.new,
    },
    {
      icon: <MovementsIcon />,
      key: 'movement',
      label: 'Nuevo movimiento',
      permission: permissions.movements.create,
      to: appRoutes.movements.new,
    },
  ];

  const visibleActions = actions.filter((action) => action.permission);

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <Card extra={<ThunderboltOutlined />} title="Acciones rápidas">
      <Row gutter={[16, 16]}>
        {visibleActions.map((action) => (
          <Col key={action.key} lg={6} md={12} xs={12}>
            <Link to={action.to}>
              <Flex
                align="center"
                className="rounded-lg px-4 py-6 transition-colors hover:bg-(--hover-bg)"
                gap="small"
                style={
                  {
                    '--hover-bg': token.colorBgTextHover,
                    border: `1px solid ${token.colorBorderSecondary}`,
                  } as React.CSSProperties
                }
                vertical
              >
                <span
                  className="text-2xl"
                  style={{ color: token.colorPrimary }}
                >
                  {action.icon}
                </span>
                <Typography.Text>{action.label}</Typography.Text>
              </Flex>
            </Link>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
