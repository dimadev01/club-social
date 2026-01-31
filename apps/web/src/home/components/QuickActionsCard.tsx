import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { Card, DuesIcon, MovementsIcon, PaymentsIcon } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

export function QuickActionsCard() {
  const permissions = usePermissions();

  const actions = [
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
    <Card extra={<PlusOutlined />} size="small" title="Acciones rápidas">
      <Space wrap>
        {visibleActions.map((action) => (
          <Link key={action.key} to={action.to}>
            <Button icon={action.icon}>{action.label}</Button>
          </Link>
        ))}
      </Space>
    </Card>
  );
}
