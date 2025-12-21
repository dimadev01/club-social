import type { ICreatePaymentDto } from '@club-social/shared/payments';
import type { ParamId } from '@club-social/shared/types';

import { useQueryClient } from '@tanstack/react-query';
import { App, Button } from 'antd';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { queryKeys } from '@/shared/lib/query-keys';
import { SaveIcon } from '@/ui/Icons/SaveIcon';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { PaymentForm, type PaymentFormData } from './PaymentForm';

export function PaymentNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const memberIdFromUrl = searchParams.get('memberId') ?? undefined;

  const createPaymentMutation = useMutation<ParamId, Error, ICreatePaymentDto>({
    mutationFn: (body) => $fetch('/payments', { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.paginated._def,
      });
      message.success('Pago creado correctamente');
      navigate(APP_ROUTES.PAYMENTS, { replace: true });
    },
  });

  const handleSubmit = (values: PaymentFormData) => {
    if (values.paymentDues.length === 0) {
      message.error('Debe seleccionar al menos una deuda para pagar');

      return;
    }

    createPaymentMutation.mutate(
      {
        date: DateFormat.isoDate(values.date.startOf('day')),
        memberId: values.memberId,
        notes: values.notes,
        paymentDues: values.paymentDues.map((pd) => ({
          amount: NumberFormat.toCents(pd.amount),
          dueId: pd.dueId,
        })),
        receiptNumber: values.receiptNumber,
      },
      {
        onSuccess: () => {
          console.log('invalidating dues pending', values.memberId);
          queryClient.invalidateQueries(
            queryKeys.dues.pending(values.memberId),
          );
        },
      },
    );
  };

  if (!permissions.payments.create) {
    return <NotFound />;
  }

  const isMutating = createPaymentMutation.isPending;

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
          Crear pago
        </Button>,
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
