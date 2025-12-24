import { UserStatusLabel } from '@club-social/shared/users';
import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { Card } from '@/ui/Card';
import { Descriptions } from '@/ui/Descriptions';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';

import { usePermissions } from './use-permissions';
import { useUser } from './useUser';

export function UserView() {
  const permissions = usePermissions();
  const { id } = useParams();
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
    <Page
      actions={[
        canEdit && (
          <Button
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
        items={[
          {
            children: user.firstName,
            label: 'Nombre',
          },
          {
            children: user.lastName,
            label: 'Apellido',
          },
          {
            children: user.email,
            label: 'Email',
          },
          {
            children: UserStatusLabel[user.status],
            label: 'Estado',
          },
        ]}
      />
    </Page>
  );
}
