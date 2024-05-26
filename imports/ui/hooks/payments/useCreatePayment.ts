import { useMutation } from '@tanstack/react-query';

import { CreatePaymentRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-request.dto';
import { CreatePaymentResponseDto } from '@domain/payments/use-cases/create-payment/create-payment-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useCreatePayment = () =>
  useMutation<CreatePaymentResponseDto, Error, CreatePaymentRequestDto>(
    [MethodsEnum.PaymentsCreate],
    (request) => Meteor.callAsync(MethodsEnum.PaymentsCreate, request),
  );
