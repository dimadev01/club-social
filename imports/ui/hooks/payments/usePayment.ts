import { GetPaymentRequest } from '@application/payments/use-cases/get-payment/get-payment.request';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { useQuery } from '@ui/hooks/useQuery';

export const usePayment = (request?: GetPaymentRequest) =>
  useQuery<GetPaymentRequest, PaymentDto>({
    methodName: MeteorMethodEnum.PaymentsGet,
    request,
  });
