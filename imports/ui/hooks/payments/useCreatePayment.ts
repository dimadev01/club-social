import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CreatePaymentRequestDto } from '@adapters/dtos/create-payment-request.dto';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useCreatePayment = () =>
  useMutation<CreatePaymentRequestDto, PaymentDto>({
    methodName: MeteorMethodEnum.PaymentsCreate,
  });
