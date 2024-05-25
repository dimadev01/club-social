import { DeletePaymentRequestDto } from '@domain/payments/use-cases/delete-payment/delete-payment-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useDeletePayment = (onSuccess: () => void) =>
  useMutation<null, Error, DeletePaymentRequestDto>(
    [MethodsEnum.PaymentsDelete],
    (request) => Meteor.callAsync(MethodsEnum.PaymentsDelete, request),
    { onSuccess: () => onSuccess() },
  );
