import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { DeletePaymentRequest } from '@application/payments/use-cases/delete-payment/delete-payment.request';
import { DeletePaymentResponse } from '@application/payments/use-cases/delete-payment/delete-payment.response';
import { useMutation } from '@ui/hooks/useMutation';

export const useDeletePayment = () =>
  useMutation<DeletePaymentRequest, DeletePaymentResponse>({
    methodName: MeteorMethodEnum.PaymentsDelete,
  });
