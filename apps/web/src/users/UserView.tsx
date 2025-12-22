import { UserStatusLabel } from '@club-social/shared/users';
import { Button, Descriptions, Grid } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { Card } from '@/ui/Card';
import { EditIcon } from '@/ui/Icons/EditIcon';
import { NotFound } from '@/ui/NotFound';

import { usePermissions } from './use-permissions';
import { useUser } from './useUser';

export function UserView() {
  const permissions = usePermissions();
  const { id } = useParams();
  const { md } = Grid.useBreakpoint();
  const navigate = useNavigate();

  const { data: user, isLoading } = useUser(id);

  if (isLoading) {
    return <Card loading />;
  }

  if (!user) {
    return <NotFound />;
  }

  const canEdit = permissions.users.update;

  return (
    <Card
      actions={[
        canEdit && (
          <Button
            icon={<EditIcon />}
            onClick={() => navigate(appRoutes.users.edit(id))}
            type="primary"
          >
            Editar
          </Button>
        ),
      ].filter(Boolean)}
      backButton
      title={user.name}
    >
      <Descriptions
        colon={!!md}
        column={md ? 2 : 1}
        layout={md ? 'horizontal' : 'vertical'}
      >
        <Descriptions.Item label="Nombre">{user.firstName}</Descriptions.Item>
        <Descriptions.Item label="Apellido">{user.lastName}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Estado">
          {UserStatusLabel[user.status]}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
