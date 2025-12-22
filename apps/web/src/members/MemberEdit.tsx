import type {
  IMemberDetailDto,
  IUpdateMemberDto,
} from '@club-social/shared/members';

import { App, Button } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { Form } from '@/ui/Form';
import { SaveIcon } from '@/ui/Icons/SaveIcon';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { MemberForm, type MemberFormData } from './MemberForm';
import { useMemberById } from './useMemberById';

export function MemberEdit() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm<MemberFormData>();
  const { setFieldsValue } = form;

  const { data: member, isLoading } = useMemberById(id);

  const updateMemberMutation = useMutation<
    IMemberDetailDto,
    Error,
    IUpdateMemberDto
  >({
    mutationFn: (body) => $fetch(`members/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      message.success('Socio actualizado correctamente');
      navigate(-1);
    },
  });

  useEffect(() => {
    if (member) {
      setFieldsValue({
        address: {
          cityName: member.address?.cityName ?? '',
          stateName: member.address?.stateName ?? '',
          street: member.address?.street ?? '',
          zipCode: member.address?.zipCode ?? '',
        },
        birthDate: member.birthDate ? dayjs.utc(member.birthDate) : null,
        category: member.category,
        documentID: member.documentID ?? '',
        email: member.email,
        fileStatus: member.fileStatus,
        firstName: member.firstName,
        lastName: member.lastName,
        maritalStatus: member.maritalStatus ?? undefined,
        nationality: member.nationality ?? undefined,
        phones: member.phones,
        sex: member.sex ?? undefined,
        status: member.status,
      });
    }
  }, [member, setFieldsValue]);

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
      phones: values.phones,
      sex: values.sex ?? null,
      status: values.status,
    });
  };

  if (!permissions.members.update) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Page loading title="Editar socio" />;
  }

  if (!member) {
    return <NotFound />;
  }

  const isMutating = updateMemberMutation.isPending;

  return (
    <Page
      actions={[
        <Button
          disabled={isMutating}
          form="form"
          htmlType="submit"
          icon={<SaveIcon />}
          loading={isMutating}
          type="primary"
        >
          Actualizar socio
        </Button>,
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
          phones: member.phones,
          sex: member.sex ?? undefined,
          status: member.status,
        }}
        mode="edit"
        onSubmit={handleSubmit}
      />
    </Page>
  );
}
