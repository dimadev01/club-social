import type { CreateMovementDto } from '@club-social/shared/movements';
import type { ParamIdDto } from '@club-social/shared/types';

import { NumberFormat } from '@club-social/shared/lib';
import { DateFormat } from '@club-social/shared/lib';
import { MovementCategory, MovementType } from '@club-social/shared/movements';
import { App } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { FormSubmitButton } from '@/ui/Form/FormSaveButton';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { MovementForm, type MovementFormData } from './MovementForm';

export function MovementNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const createMovementMutation = useMutation<
    ParamIdDto,
    Error,
    CreateMovementDto
  >({
    mutationFn: (body) => $fetch('/movements', { body }),
    onSuccess: () => {
      message.success('Movimiento creado correctamente');
      navigate(appRoutes.movements.list, { replace: true });
    },
  });

  const handleSubmit = async (values: MovementFormData) => {
    const amount = NumberFormat.toCents(values.amount);
    const date = DateFormat.isoDate(values.date);

    createMovementMutation.mutate({
      amount,
      category: values.category,
      date,
      notes: values.notes || null,
      type: values.type,
    });
  };

  if (!permissions.movements.create) {
    return <NotFound />;
  }

  const isMutating = createMovementMutation.isPending;

  return (
    <Page
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Crear movimiento
        </FormSubmitButton>,
      ]}
      backButton
      title="Nuevo movimiento"
    >
      <MovementForm
        disabled={isMutating}
        initialValues={{
          amount: 0,
          category: MovementCategory.OTHER,
          date: dayjs(),
          notes: null,
          type: MovementType.OUTFLOW,
        }}
        onSubmit={handleSubmit}
      />
    </Page>
  );
}
