import { useQuery } from '@tanstack/react-query';

import type { GetNextPaymentReceiptNumberResponseDto } from '@domain/payments/use-cases/get-next-payment-receipt-number/get-next-payment-receipt-number-response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useNextPaymentReceiptNumber = (enabled = true) =>
  useQuery<null, Error, GetNextPaymentReceiptNumberResponseDto>(
    [MeteorMethodEnum.PaymentsGetNextReceiptNumber],
    () => Meteor.callAsync(MeteorMethodEnum.PaymentsGetNextReceiptNumber),
    { enabled },
  );
