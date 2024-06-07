import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { VoidPaymentRequestDto } from '@adapters/dtos/void-payment-request.dto';
import { useMutation } from '@ui/hooks/useMutation';

export const useVoidPayment = () =>
  useMutation<VoidPaymentRequestDto, null>({
    methodName: MeteorMethodEnum.PaymentsVoid,
  });
