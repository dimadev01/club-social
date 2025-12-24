import type { IUpdateUserDto } from '@club-social/shared/users';

import { App, Button } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';

import { usePermissions } from './use-permissions';
import { UserForm, type UserFormData } from './UserForm';
import { useUser } from './useUser';

export function UserEdit() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading } = useUser(id);

  const updateUserMutation = useMutation<unknown, Error, IUpdateUserDto>({
    mutationFn: (body) => $fetch(`users/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      message.success('Usuario actualizado correctamente');
      navigate(-1);
    },
  });

  const handleSubmit = (values: UserFormData) => {
    updateUserMutation.mutate({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      status: values.status,
    });
  };

  if (!permissions.users.update) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Page loading title="Editar usuario" />;
  }

  if (!user) {
    return <NotFound />;
  }

  const isMutating = updateUserMutation.isPending;

  return (
    <Page
      actions={[
        <Button
          disabled={isMutating}
          form="form"
          htmlType="submit"
          loading={isMutating}
          type="primary"
        >
          Actualizar usuario
        </Button>,
      ]}
      backButton
      title={user.name}
    >
      <UserForm
        disabled={isMutating}
        initialValues={{
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
        }}
        mode="edit"
        onSubmit={handleSubmit}
      />
    </Page>
  );
}
