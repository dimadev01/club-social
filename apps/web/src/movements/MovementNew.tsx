import type { CreateMovementDto } from '@club-social/shared/movements';
import type { ParamIdDto } from '@club-social/shared/types';

import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { MovementCategory, MovementType } from '@club-social/shared/movements';
import { usePostHog } from '@posthog/react';
import { App, type FormInstance } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { PostHogEvent } from '@/shared/lib/posthog-events';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { FormSubmitButtonAndBack } from '@/ui/Form/FormSubmitAndBack';
import { usePermissions } from '@/users/use-permissions';

import { MovementForm, type MovementFormData } from './MovementForm';

export function MovementNew() {
  const { message } = App.useApp();
  const posthog = usePostHog();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const shouldNavigateBack = useRef(false);

  const createMovementMutation = useMutation<
    ParamIdDto,
    Error,
    CreateMovementDto
  >({
    mutationFn: (body) => $fetch('/movements', { body }),
  });

  const handleSubmit = async (
    values: MovementFormData,
    form: FormInstance<MovementFormData>,
  ) => {
    const amount = NumberFormat.toCents(values.amount);
    const date = DateFormat.isoDate(values.date);

    createMovementMutation.mutate(
      {
        amount,
        category: values.category,
        date,
        notes: values.notes || null,
        type: values.type,
      },
      {
        onSuccess: () => {
          message.success('Movimiento creado correctamente');
          posthog.capture(PostHogEvent.MOVEMENT_CREATED, {
            category: values.category,
            type: values.type,
          });

          if (shouldNavigateBack.current) {
            navigate(-1);
          } else {
            form.resetFields(['amount', 'notes']);
          }
        },
      },
    );
  };

  if (!permissions.movements.create) {
    return <NotFound />;
  }

  const isMutating = createMovementMutation.isPending;

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
    </Card>
  );
}
