import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetPaymentsTotalsRequestDto } from '@adapters/dtos/get-payments-totals-request.dto';
import { GetPaymentsTotalsResponse } from '@domain/payments/payment.repository';
import { useQuery } from '@ui/hooks/query/useQuery';

export const usePaymentsTotals = (request: GetPaymentsTotalsRequestDto) =>
  useQuery<GetPaymentsTotalsRequestDto, GetPaymentsTotalsResponse>({
    methodName: MeteorMethodEnum.PaymentsGetTotals,
    request,
  });
