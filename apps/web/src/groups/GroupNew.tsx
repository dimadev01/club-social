import type { CreateGroupDto } from '@club-social/shared/groups';
import type { ParamIdDto } from '@club-social/shared/types';

import { App, type FormInstance } from 'antd';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { FormSubmitButtonAndBack } from '@/ui/Form/FormSubmitAndBack';
import { usePermissions } from '@/users/use-permissions';

import { GroupForm, type GroupFormData } from './GroupForm';

export function GroupNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const shouldNavigateBack = useRef(false);

  const createGroupMutation = useMutation<ParamIdDto, Error, CreateGroupDto>({
    mutationFn: (body) => $fetch('/groups', { body, method: 'POST' }),
  });

  const handleSubmit = (
    values: GroupFormData,
    form: FormInstance<GroupFormData>,
  ) => {
    createGroupMutation.mutate(
      {
        memberIds: values.memberIds,
        name: values.name,
      },
      {
        onSuccess: () => {
          message.success('Grupo creado correctamente');

          if (shouldNavigateBack.current) {
            navigate(-1);
          } else {
            form.resetFields(['memberIds', 'name']);
          }
        },
      },
    );
  };

  if (!permissions.groups.create) {
    return <NotFound />;
  }

  const isMutating = createGroupMutation.isPending;

  return (
    <Card
      actions={[
        <FormSubmitButtonAndBack
          disabled={isMutating}
          loading={isMutating}
          onClick={() => (shouldNavigateBack.current = true)}
        />,
        <FormSubmitButton
          disabled={isMutating}
          loading={isMutating}
          onClick={() => (shouldNavigateBack.current = false)}
        >
          Crear grupo
        </FormSubmitButton>,
      ]}
      backButton
      title="Nuevo grupo"
    >
      <GroupForm
        disabled={isMutating}
        initialValues={{ memberIds: [], name: undefined }}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
