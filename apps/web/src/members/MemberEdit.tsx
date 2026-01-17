import type { MemberDto, UpdateMemberDto } from '@club-social/shared/members';

import { DateFormat } from '@club-social/shared/lib';
import { App } from 'antd';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { MemberForm, type MemberFormData } from './MemberForm';
import { useMemberById } from './useMemberById';

export function MemberEdit() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: member, isLoading } = useMemberById(id);

  const updateMemberMutation = useMutation<MemberDto, Error, UpdateMemberDto>({
    mutationFn: (body) => $fetch(`members/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      message.success('Socio actualizado correctamente');
      navigate(-1);
    },
  });

  const handleSubmit = (values: MemberFormData) => {
    updateMemberMutation.mutate({
      address: {
        cityName: values.address.cityName || null,
        stateName: values.address.stateName || null,
        street: values.address.street || null,
        zipCode: values.address.zipCode || null,
      },
      birthDate: values.birthDate ? DateFormat.isoDate(values.birthDate) : null,
      category: values.category,
      documentID: values.documentID || null,
      email: values.email,
      fileStatus: values.fileStatus,
      firstName: values.firstName,
      lastName: values.lastName,
      maritalStatus: values.maritalStatus ?? null,
      nationality: values.nationality ?? null,
      notificationPreferences: {
        notifyOnDueCreated: values.notificationPreferences.notifyOnDueCreated,
        notifyOnPaymentMade: values.notificationPreferences.notifyOnPaymentMade,
      },
      phones: values.phones,
      sex: values.sex ?? null,
      status: values.status,
    });
  };

  if (!permissions.members.update) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Card loading title="Editar socio" />;
  }

  if (!member) {
    return <NotFound />;
  }

  const isMutating = updateMemberMutation.isPending;

  return (
    <Card
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Actualizar socio
        </FormSubmitButton>,
      ]}
      backButton
      title={member.name}
    >
      <MemberForm
        disabled={isMutating}
        initialValues={{
          address: {
            cityName: member.address?.cityName ?? '',
            stateName: member.address?.stateName ?? '',
            street: member.address?.street ?? '',
            zipCode: member.address?.zipCode ?? '',
          },
          birthDate: member.birthDate ? dayjs.utc(member.birthDate) : undefined,
          category: member.category,
          documentID: member.documentID ?? '',
          email: member.email,
          fileStatus: member.fileStatus,
          firstName: member.firstName,
          lastName: member.lastName,
          maritalStatus: member.maritalStatus ?? undefined,
          nationality: member.nationality ?? undefined,
          notificationPreferences: {
            notifyOnDueCreated:
              member.notificationPreferences.notifyOnDueCreated,
            notifyOnPaymentMade:
              member.notificationPreferences.notifyOnPaymentMade,
          },
          phones: member.phones,
          sex: member.sex ?? undefined,
          status: member.status,
        }}
        mode="edit"
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
