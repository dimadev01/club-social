import type { ParamIdDto } from '@club-social/shared/types';
import type { ICreateUserDto } from '@club-social/shared/users';

import { App } from 'antd';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { FormSubmitButton } from '@/ui/Form/FormSaveButton';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';

import { usePermissions } from './use-permissions';
import { UserForm, type UserFormData } from './UserForm';

export function UserNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const createUserMutation = useMutation<ParamIdDto, Error, ICreateUserDto>({
    mutationFn: (body) => $fetch('users', { body }),
    onSuccess: (data) => {
      message.success('Usuario creado correctamente');
      navigate(appRoutes.users.view(data.id), { replace: true });
    },
  });

  const handleSubmit = (values: UserFormData) => {
    createUserMutation.mutate({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
    });
  };

  if (!permissions.users.create) {
    return <NotFound />;
  }

  const isMutating = createUserMutation.isPending;

  return (
    <Page
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Crear usuario
        </FormSubmitButton>,
      ]}
      backButton
      title="Nuevo usuario"
    >
      <UserForm
        disabled={isMutating}
        initialValues={{
          email: '',
          firstName: '',
          lastName: '',
        }}
        mode="create"
        onSubmit={handleSubmit}
      />
    </Page>
  );
}
