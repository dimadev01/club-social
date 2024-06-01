import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import type { GetNextPaymentReceiptNumberResponseDto } from '@domain/payments/use-cases/get-next-payment-receipt-number/get-next-payment-receipt-number-response.dto';

export const useNextPaymentReceiptNumber = (enabled = true) =>
  useQuery<null, Error, GetNextPaymentReceiptNumberResponseDto>(
    [MeteorMethodEnum.PaymentsGetNextReceiptNumber],
    () => Meteor.callAsync(MeteorMethodEnum.PaymentsGetNextReceiptNumber),
    { enabled },
  );
