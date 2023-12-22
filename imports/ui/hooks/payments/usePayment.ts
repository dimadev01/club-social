import { GetPaymentRequestDto } from '@domain/payments/use-cases/get-payment/get-payment-request.dto';
import { GetPaymentResponseDto } from '@domain/payments/use-cases/get-payment/get-payment-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@tanstack/react-query';

export const usePayment = (id?: string) =>
  useQuery<GetPaymentRequestDto, Error, GetPaymentResponseDto | undefined>(
    [MethodsEnum.PaymentsGet, id],
    () => Meteor.callAsync(MethodsEnum.PaymentsGet, { id }),
    { enabled: !!id }
  );
