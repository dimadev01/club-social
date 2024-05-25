import type { GetNextPaymentReceiptNumberResponseDto } from '@domain/payments/use-cases/get-next-payment-receipt-number/get-next-payment-receipt-number-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useNextPaymentReceiptNumber = (enabled = true) =>
  useQuery<null, Error, GetNextPaymentReceiptNumberResponseDto>(
    [MethodsEnum.PaymentsGetNextReceiptNumber],
    () => Meteor.callAsync(MethodsEnum.PaymentsGetNextReceiptNumber),
    { enabled },
  );
