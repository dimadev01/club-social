import type { IUpdateDueDto } from '@club-social/shared/dues';

import { DueStatus, DueStatusLabel } from '@club-social/shared/dues';
import { App, Button, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { Form } from '@/ui/Form';
import { SaveIcon } from '@/ui/Icons/SaveIcon';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { DueStatusColor } from './due.types';
import { DueForm, type DueFormData } from './DueForm';
import { useDue } from './useDue';

export function DueEdit() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm<DueFormData>();
  const { setFieldsValue } = form;

  const { data: due, isLoading } = useDue(id);

  const updateDueMutation = useMutation<unknown, Error, IUpdateDueDto>({
    mutationFn: (body) => $fetch(`dues/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      message.success('Cuota actualizada correctamente');
      navigate(-1);
    },
  });

  useEffect(() => {
    if (due) {
      setFieldsValue({
        amount: NumberFormat.fromCents(due.amount),
        category: due.category,
        date: dayjs.utc(due.date),
        memberIds: [due.memberId],
        notes: due.notes,
      });
    }
  }, [due, setFieldsValue]);

  const handleSubmit = (values: DueFormData) => {
    const amount = NumberFormat.toCents(values.amount);
    updateDueMutation.mutate({ amount, notes: values.notes || null });
  };

  if (!permissions.dues.update) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Page loading title="Editar deuda" />;
  }

  if (!due) {
    return <NotFound />;
  }

  if (due.status !== DueStatus.PENDING) {
    return <NotFound />;
  }

  const isMutating = updateDueMutation.isPending;

  const memberAdditionalOptions = [
    {
      id: due.memberId,
      name: due.memberName,
      status: due.userStatus,
    },
  ];

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
          Actualizar deuda
        </Button>,
      ]}
      backButton
      extra={
        <Tag color={DueStatusColor[due.status]}>
          {DueStatusLabel[due.status]}
        </Tag>
      }
      title="Editar deuda"
    >
      <DueForm
        additionalMemberOptions={memberAdditionalOptions}
        disabled={isMutating}
        initialValues={{
          amount: NumberFormat.fromCents(due.amount),
          category: due.category,
          date: dayjs.utc(due.date),
          memberIds: [due.memberId],
          notes: due.notes,
        }}
        loading={isLoading}
        mode="edit"
        onSubmit={handleSubmit}
      />
    </Page>
  );
}
