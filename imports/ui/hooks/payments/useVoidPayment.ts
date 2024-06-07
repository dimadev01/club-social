import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { VoidPaymentMethodRequestDto } from '@infra/meteor/dtos/void-payment-method-request.dto';
import { useMutation } from '@ui/hooks/useMutation';

export const useVoidPayment = () =>
  useMutation<VoidPaymentMethodRequestDto, null>({
    methodName: MeteorMethodEnum.PaymentsVoid,
  });
