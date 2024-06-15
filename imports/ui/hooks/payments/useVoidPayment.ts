import { VoidPaymentMethodRequestDto } from '@infra/meteor/dtos/void-payment-method-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useVoidPayment = () =>
  useMutation<VoidPaymentMethodRequestDto, null>({
    methodName: MeteorMethodEnum.PaymentsVoid,
  });
