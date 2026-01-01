import type { UpdateUserDto } from '@club-social/shared/users';

import { App } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card } from '@/ui/Card';
import { FormSubmitButton } from '@/ui/Form/FormSaveButton';
import { NotFound } from '@/ui/NotFound';

import { usePermissions } from './use-permissions';
import { UserForm, type UserFormData } from './UserForm';
import { useUser } from './useUser';

export function UserEdit() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading } = useUser(id);

  const updateUserMutation = useMutation<unknown, Error, UpdateUserDto>({
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
    return <Card loading title="Editar usuario" />;
  }

  if (!user) {
    return <NotFound />;
  }

  const isMutating = updateUserMutation.isPending;

  return (
    <Card
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Actualizar usuario
        </FormSubmitButton>,
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
    </Card>
  );
}
