import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { CreatePaymentRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-request.dto';
import { CreatePaymentResponseDto } from '@domain/payments/use-cases/create-payment/create-payment-response.dto';

export const useCreatePayment = () =>
  useMutation<CreatePaymentResponseDto, Error, CreatePaymentRequestDto>(
    [MeteorMethodEnum.PaymentsCreate],
    (request) => Meteor.callAsync(MeteorMethodEnum.PaymentsCreate, request),
  );
