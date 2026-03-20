import type { ParamIdDto } from '@club-social/shared/types';
import type { CreateUserDto } from '@club-social/shared/users';

import { usePostHog } from '@posthog/react';
import { App } from 'antd';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { PostHogEvent } from '@/shared/lib/posthog-events';
import {
  Card,
  FormSubmitButton,
  NotFound,
  Page,
  PageHeader,
  PageTitle,
} from '@/ui';

import { usePermissions } from './use-permissions';
import { UserForm, type UserFormData } from './UserForm';

export function UserNew() {
  const { message } = App.useApp();
  const posthog = usePostHog();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const createUserMutation = useMutation<ParamIdDto, Error, CreateUserDto>({
    mutationFn: (body) => $fetch('users', { body }),
    onSuccess: (data) => {
      message.success('Usuario creado correctamente');
      posthog.capture(PostHogEvent.USER_CREATED);
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
    <Page>
      <PageHeader backButton>
        <PageTitle>Nuevo usuario</PageTitle>
      </PageHeader>
      <Card
        actions={[
          <FormSubmitButton disabled={isMutating} loading={isMutating}>
            Crear usuario
          </FormSubmitButton>,
        ]}
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
      </Card>
    </Page>
  );
}
