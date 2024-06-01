import { GetPaymentsGridRequestDto } from '@domain/payments/use-cases/get-payments-grid-old/get-payments-grid-old.request.dto';
import { GetPaymentsGridResponseDto } from '@domain/payments/use-cases/get-payments-grid-old/get-payments-grid-old.response.dto';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { useQueryGrid } from '@adapters/ui/hooks/useQueryGrid';

export const usePaymentGrid = (request: GetPaymentsGridRequestDto) =>
  useQueryGrid<GetPaymentsGridRequestDto, GetPaymentsGridResponseDto>({
    methodName: MeteorMethodEnum.PaymentsGetGrid,
    request,
  });
