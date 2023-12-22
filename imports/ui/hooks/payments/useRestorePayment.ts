import { RestorePaymentRequestDto } from '@domain/payments/use-cases/restore-payment/restore-payment-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useRestorePayment = (onSuccess: () => void) =>
  useMutation<null, Error, RestorePaymentRequestDto>(
    [MethodsEnum.PaymentsRestore],
    (request) => Meteor.callAsync(MethodsEnum.PaymentsRestore, request),
    { onSuccess: () => onSuccess() }
  );
