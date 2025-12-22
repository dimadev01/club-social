import type { ICreateMovementDto } from '@club-social/shared/movements';
import type { ParamId } from '@club-social/shared/types';

import { MovementCategory, MovementType } from '@club-social/shared/movements';
import { App, Button } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { SaveIcon } from '@/ui/Icons/SaveIcon';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { MovementForm, type MovementFormData } from './MovementForm';

export function MovementNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const createMovementMutation = useMutation<
    ParamId,
    Error,
    ICreateMovementDto
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
      description: values.description || null,
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
        <Button
          disabled={isMutating}
          form="form"
          htmlType="submit"
          icon={<SaveIcon />}
          loading={isMutating}
          type="primary"
        >
          Crear movimiento
        </Button>,
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
          description: null,
          type: MovementType.OUTFLOW,
        }}
        onSubmit={handleSubmit}
      />
    </Page>
  );
}
