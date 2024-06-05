import { CreatePaymentResponse } from '@application/payments/use-cases/create-payment/create-payment.response';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CreatePaymentRequest } from '@application/payments/use-cases/create-payment/create-payment.request';
import { useMutation } from '@ui/hooks/useMutation';

export const useCreatePayment = () =>
  useMutation<CreatePaymentRequest, CreatePaymentResponse>({
    methodName: MeteorMethodEnum.PaymentsCreate,
  });
