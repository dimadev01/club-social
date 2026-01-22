import type { CreateDueDto } from '@club-social/shared/dues';
import type { ParamIdDto } from '@club-social/shared/types';
import type { FormInstance } from 'antd/lib';

import { DueCategory, DueCreationMode } from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { App } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { FormSubmitButtonAndBack } from '@/ui/Form/FormSubmitAndBack';
import { usePermissions } from '@/users/use-permissions';

import { DueForm, type DueFormData } from './DueForm';

export function DueNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldNavigateBack = useRef(false);
  const memberIdFromUrl = searchParams.get('memberId') ?? undefined;

  const createDueMutation = useMutation<ParamIdDto, Error, CreateDueDto>({
    mutationFn: (body) => $fetch('/dues', { body }),
  });

  const handleSubmit = async (
    values: DueFormData,
    form: FormInstance<DueFormData>,
  ) => {
    const amount = NumberFormat.toCents(values.amount);

    let date: string;

    if (values.category === DueCategory.MEMBERSHIP) {
      date = DateFormat.isoDate(values.date.startOf('month'));
    } else {
      date = DateFormat.isoDate(values.date.startOf('day'));
    }

    const results = await Promise.allSettled(
      values.memberIds.map((memberId) =>
        createDueMutation.mutateAsync({
          amount,
          category: values.category,
          creationMode: DueCreationMode.MANUAL,
          date,
          memberId,
          notes: values.notes || null,
        }),
      ),
    );

    const successfulResults = results.filter(
      (result) => result.status === 'fulfilled',
    );
    const failedResults = results.filter(
      (result) => result.status === 'rejected',
    );

    if (failedResults.length > 0) {
      message.error('Error al crear algunas deudas');

      return;
    }

    if (successfulResults.length === 1) {
      message.success('1 deuda creada correctamente');
    } else {
      message.success(
        `${successfulResults.length} deudas creadas correctamente`,
      );
    }

    if (shouldNavigateBack.current) {
      navigate(-1);
    } else {
      form.resetFields(['memberIds', 'notes']);
    }
  };

  if (!permissions.dues.create) {
    return <NotFound />;
  }

  const isMutating = createDueMutation.isPending;

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
          Crear deuda
        </FormSubmitButton>,
      ]}
      backButton
      title="Nueva deuda"
    >
      <DueForm
        disabled={isMutating}
        initialValues={{
          amount: 0,
          category: DueCategory.MEMBERSHIP,
          date: dayjs(),
          memberIds: memberIdFromUrl ? [memberIdFromUrl] : [],
          notes: null,
        }}
        mode="create"
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
