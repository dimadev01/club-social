import type { UpdateDueDto } from '@club-social/shared/dues';
import type { MemberSearchResultDto } from '@club-social/shared/members';

import { DueStatus } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { App } from 'antd';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { FormSubmitButton } from '@/ui/Form/FormSaveButton';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { DueForm, type DueFormData } from './DueForm';
import { useDue } from './useDue';

export function DueEdit() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: due, isLoading } = useDue(id);

  const updateDueMutation = useMutation<unknown, Error, UpdateDueDto>({
    mutationFn: (body) => $fetch(`dues/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      message.success('Cuota actualizada correctamente');
      navigate(-1);
    },
  });

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

  const memberAdditionalOptions: MemberSearchResultDto[] = [
    {
      category: due.member.category,
      id: due.member.id,
      name: due.member.name,
      status: due.member.status,
    },
  ];

  return (
    <Page
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Actualizar deuda
        </FormSubmitButton>,
      ]}
      backButton
      title="Editar deuda"
    >
      <DueForm
        additionalMemberOptions={memberAdditionalOptions}
        disabled={isMutating}
        initialValues={{
          amount: NumberFormat.fromCents(due.amount),
          category: due.category,
          date: dayjs.utc(due.date),
          memberIds: [due.member.id],
          notes: due.notes,
        }}
        loading={isLoading}
        mode="edit"
        onSubmit={handleSubmit}
      />
    </Page>
  );
}
