import { useMutation } from '@tanstack/react-query';

import { DeletePaymentRequestDto } from '@domain/payments/use-cases/delete-payment/delete-payment-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useDeletePayment = (onSuccess: () => void) =>
  useMutation<null, Error, DeletePaymentRequestDto>(
    [MeteorMethodEnum.PaymentsDelete],
    (request) => Meteor.callAsync(MeteorMethodEnum.PaymentsDelete, request),
    { onSuccess: () => onSuccess() },
  );
