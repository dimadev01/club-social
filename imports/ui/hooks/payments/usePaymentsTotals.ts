import { GetPaymentsTotalsResponse } from '@application/payments/repositories/payment.repository';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetPaymentsTotalsRequestDto } from '@ui/dtos/get-payments-totals-request.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const usePaymentsTotals = (request: GetPaymentsTotalsRequestDto) =>
  useQuery<GetPaymentsTotalsRequestDto, GetPaymentsTotalsResponse>({
    methodName: MeteorMethodEnum.PaymentsGetTotals,
    request,
  });
