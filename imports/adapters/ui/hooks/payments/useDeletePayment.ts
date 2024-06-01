import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { DeletePaymentRequestDto } from '@domain/payments/use-cases/delete-payment/delete-payment-request.dto';

export const useDeletePayment = (onSuccess: () => void) =>
  useMutation<null, Error, DeletePaymentRequestDto>(
    [MeteorMethodEnum.PaymentsDelete],
    (request) => Meteor.callAsync(MeteorMethodEnum.PaymentsDelete, request),
    { onSuccess: () => onSuccess() },
  );
