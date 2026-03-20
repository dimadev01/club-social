import { UserStatusLabel } from '@club-social/shared/users';
import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import {
  Card,
  Descriptions,
  NotFound,
  Page,
  PageHeader,
  PageTitle,
} from '@/ui';

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
    <Page>
      <PageHeader backButton>
        <PageTitle>{user.name}</PageTitle>
      </PageHeader>
      <Card
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
      </Card>
    </Page>
  );
}
