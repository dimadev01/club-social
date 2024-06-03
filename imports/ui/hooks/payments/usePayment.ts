import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetPaymentRequest } from '@application/payments/use-cases/get-payment/get-payment.request';
import { GetPaymentResponse } from '@application/payments/use-cases/get-payment/get-payment.response';
import { useQuery } from '@ui/hooks/useQuery';

export const usePayment = (request?: GetPaymentRequest) =>
  useQuery<GetPaymentRequest, GetPaymentResponse>({
    methodName: MeteorMethodEnum.PaymentsGet,
    request,
  });
