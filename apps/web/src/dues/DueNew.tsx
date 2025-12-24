import type { CreateDueDto } from '@club-social/shared/dues';
import type { ParamId } from '@club-social/shared/types';

import { DueCategory } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { App, Button } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { DueForm, type DueFormData } from './DueForm';

export function DueNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const createDueMutation = useMutation<ParamId, Error, CreateDueDto>({
    mutationFn: (body) => $fetch('/dues', { body }),
  });

  const handleSubmit = async (values: DueFormData) => {
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

    navigate(appRoutes.dues.list, { replace: true });
  };

  if (!permissions.dues.create) {
    return <NotFound />;
  }

  const isMutating = createDueMutation.isPending;

  return (
    <Page
      actions={[
        <Button
          disabled={isMutating}
          form="form"
          htmlType="submit"
          loading={isMutating}
          type="primary"
        >
          Crear deuda
        </Button>,
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
          memberIds: [],
          notes: null,
        }}
        mode="create"
        onSubmit={handleSubmit}
      />
    </Page>
  );
}
