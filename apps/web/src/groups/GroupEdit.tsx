import type { GroupDto, UpdateGroupDto } from '@club-social/shared/groups';
import type { MemberSearchResultDto } from '@club-social/shared/members';

import { App } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { GroupForm, type GroupFormData } from './GroupForm';
import { useGroup } from './useGroup';

export function GroupEdit() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: group, isLoading } = useGroup(id);

  const updateGroupMutation = useMutation<GroupDto, Error, UpdateGroupDto>({
    mutationFn: (body) => $fetch(`groups/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      message.success('Grupo actualizado correctamente');
      navigate(-1);
    },
  });

  const handleSubmit = (values: GroupFormData) => {
    updateGroupMutation.mutate({
      discountPercent: values.discountPercent,
      memberIds: values.memberIds,
      name: values.name,
    });
  };

  if (!permissions.groups.update) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Card loading title="Editar grupo" />;
  }

  if (!group) {
    return <NotFound />;
  }

  const isMutating = updateGroupMutation.isPending;

  const memberAdditionalOptions: MemberSearchResultDto[] = group.members.map(
    (member) => ({
      category: member.category,
      id: member.id,
      name: member.name,
      status: member.status,
    }),
  );

  return (
    <Card
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Actualizar grupo
        </FormSubmitButton>,
      ]}
      backButton
      title="Editar grupo"
    >
      <GroupForm
        additionalMemberOptions={memberAdditionalOptions}
        disabled={isMutating}
        initialValues={{
          discountPercent: group.discountPercent,
          memberIds: group.members.map((member) => member.id),
          name: group.name,
        }}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
