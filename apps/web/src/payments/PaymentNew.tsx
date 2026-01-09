import type { CreatePaymentDto } from '@club-social/shared/payments';
import type { ParamIdDto } from '@club-social/shared/types';

import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { App, type FormInstance } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { FormSubmitButtonAndBack } from '@/ui/Form/FormSubmitAndBack';
import { usePermissions } from '@/users/use-permissions';

import { PaymentForm, type PaymentFormSchema } from './PaymentForm';

export function PaymentNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldNavigateBack = useRef(false);

  const memberIdFromUrl = searchParams.get('memberId') ?? undefined;

  const createPaymentMutation = useMutation<
    ParamIdDto,
    Error,
    CreatePaymentDto
  >({
    mutationFn: (body) => $fetch('/payments', { body }),
  });

  const handleSubmit = async (
    values: PaymentFormSchema,
    form: FormInstance<PaymentFormSchema>,
  ) => {
    if (values.dues.length === 0) {
      message.error('Debe seleccionar al menos una deuda para pagar');

      return;
    }

    createPaymentMutation.mutate(
      {
        date: DateFormat.isoDate(values.date.startOf('day')),
        dues: values.dues.map((due) => ({
          amount: NumberFormat.toCents(due.amount),
          amountFromBalance: due.amountFromBalance
            ? NumberFormat.toCents(due.amountFromBalance)
            : null,
          dueId: due.dueId,
        })),
        memberId: values.memberId,
        notes: values.notes,
        receiptNumber: values.receiptNumber,
        surplusToCreditAmount: values.surplusToCreditAmount
          ? NumberFormat.toCents(values.surplusToCreditAmount)
          : null,
      },
      {
        onSuccess: () => {
          message.success('Pago creado correctamente');

          if (shouldNavigateBack.current) {
            navigate(-1);
          } else {
            form.resetFields([
              'memberId',
              'dues',
              'notes',
              'receiptNumber',
              'useSurplusToCredit',
              'surplusToCreditAmount',
            ]);
          }
        },
      },
    );
  };

  if (!permissions.payments.create) {
    return <NotFound />;
  }

  const isMutating = createPaymentMutation.isPending;

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
          Crear pago
        </FormSubmitButton>,
      ]}
      backButton
      title="Nuevo pago"
    >
      <PaymentForm
        disabled={isMutating}
        initialValues={{
          date: dayjs(),
          dues: [],
          memberId: memberIdFromUrl,
          notes: '',
          receiptNumber: '',
        }}
        mode="create"
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
