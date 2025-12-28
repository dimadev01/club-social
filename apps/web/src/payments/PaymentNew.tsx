import type { CreatePaymentDto } from '@club-social/shared/payments';
import type { ParamIdDto } from '@club-social/shared/types';

import { NumberFormat } from '@club-social/shared/lib';
import { DateFormat } from '@club-social/shared/lib';
import { App } from 'antd';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { FormSubmitButton } from '@/ui/Form/FormSaveButton';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { PaymentForm, type PaymentFormData } from './PaymentForm';

export function PaymentNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const memberIdFromUrl = searchParams.get('memberId') ?? undefined;

  const createPaymentMutation = useMutation<
    ParamIdDto,
    Error,
    CreatePaymentDto
  >({
    mutationFn: (body) => $fetch('/payments', { body }),
    onSuccess: () => {
      message.success('Pago creado correctamente');
      navigate(appRoutes.payments.list, { replace: true });
    },
  });

  const handleSubmit = (values: PaymentFormData) => {
    if (values.paymentDues.length === 0) {
      message.error('Debe seleccionar al menos una deuda para pagar');

      return;
    }

    createPaymentMutation.mutate({
      date: DateFormat.isoDate(values.date.startOf('day')),
      memberId: values.memberId,
      notes: values.notes,
      paymentDues: values.paymentDues.map((pd) => ({
        amount: NumberFormat.toCents(pd.amount),
        dueId: pd.dueId,
      })),
      receiptNumber: values.receiptNumber,
    });
  };

  if (!permissions.payments.create) {
    return <NotFound />;
  }

  const isMutating = createPaymentMutation.isPending;

  return (
    <Page
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
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
          memberId: memberIdFromUrl,
          notes: '',
          paymentDues: [],
          receiptNumber: '',
        }}
        mode="create"
        onSubmit={handleSubmit}
      />
    </Page>
  );
}
