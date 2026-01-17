import type { CreateMemberDto } from '@club-social/shared/members';
import type { ParamIdDto } from '@club-social/shared/types';

import { DateFormat } from '@club-social/shared/lib';
import { FileStatus, MemberCategory } from '@club-social/shared/members';
import { App } from 'antd';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { MemberForm, type MemberFormData } from './MemberForm';

export function MemberNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const createMemberMutation = useMutation<ParamIdDto, Error, CreateMemberDto>({
    mutationFn: (body) => $fetch('members', { body }),
    onSuccess: (data) => {
      message.success('Socio creado correctamente');
      navigate(appRoutes.members.view(data.id), { replace: true });
    },
  });

  const handleSubmit = (values: MemberFormData) => {
    createMemberMutation.mutate({
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
      phones: values.phones,
      sex: values.sex ?? null,
    });
  };

  if (!permissions.members.create) {
    return <NotFound />;
  }

  const isMutating = createMemberMutation.isPending;

  return (
    <Card
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Crear socio
        </FormSubmitButton>,
      ]}
      backButton
      title="Nuevo socio"
    >
      <MemberForm
        disabled={isMutating}
        initialValues={{
          address: {
            cityName: '',
            stateName: '',
            street: '',
            zipCode: '',
          },
          birthDate: undefined,
          category: MemberCategory.MEMBER,
          documentID: '',
          email: '',
          fileStatus: FileStatus.PENDING,
          firstName: '',
          lastName: '',
          maritalStatus: undefined,
          nationality: undefined,
          notificationPreferences: {
            notifyOnDueCreated: true,
            notifyOnPaymentMade: true,
          },
          phones: [],
          sex: undefined,
        }}
        mode="create"
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
