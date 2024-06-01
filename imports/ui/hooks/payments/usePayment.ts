import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetPaymentRequestDto } from '@domain/payments/use-cases/get-payment/get-payment-request.dto';
import { GetPaymentResponseDto } from '@domain/payments/use-cases/get-payment/get-payment-response.dto';

export const usePayment = (id?: string) =>
  useQuery<GetPaymentRequestDto, Error, GetPaymentResponseDto | undefined>(
    [MeteorMethodEnum.PaymentsGet, id],
    () => Meteor.callAsync(MeteorMethodEnum.PaymentsGet, { id }),
    { enabled: !!id },
  );
