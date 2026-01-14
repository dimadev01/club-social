import type { CreateGroupDto } from '@club-social/shared/groups';
import type { ParamIdDto } from '@club-social/shared/types';

import { App } from 'antd';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { GroupForm, type GroupFormData } from './GroupForm';

export function GroupNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const createGroupMutation = useMutation<ParamIdDto, Error, CreateGroupDto>({
    mutationFn: (body) => $fetch('/groups', { body, method: 'POST' }),
    onSuccess: (data) => {
      message.success('Grupo creado correctamente');
      navigate(appRoutes.groups.view(data.id), { replace: true });
    },
  });

  const handleSubmit = (values: GroupFormData) => {
    createGroupMutation.mutate({
      name: values.name,
    });
  };

  if (!permissions.groups.create) {
    return <NotFound />;
  }

  const isMutating = createGroupMutation.isPending;

  return (
    <Card
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Crear grupo
        </FormSubmitButton>,
      ]}
      backButton
      title="Nuevo grupo"
    >
      <GroupForm
        disabled={isMutating}
        initialValues={{ name: '' }}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
