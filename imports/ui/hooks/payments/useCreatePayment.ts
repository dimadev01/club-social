import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { CreatePaymentRequestDto } from '@ui/dtos/create-payment-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useCreatePayment = () =>
  useMutation<CreatePaymentRequestDto, PaymentDto>({
    methodName: MeteorMethodEnum.PaymentsCreate,
  });
