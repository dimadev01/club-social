import { UpdatePaymentRequestDto } from '@domain/payments/use-cases/update-payment/update-payment-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useUpdatePayment = () =>
  useMutation<null, Error, UpdatePaymentRequestDto>(
    [MethodsEnum.PaymentsUpdate],
    (request) => Meteor.callAsync(MethodsEnum.PaymentsUpdate, request)
  );
