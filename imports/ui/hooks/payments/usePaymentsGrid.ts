import { GetPaymentsGridRequestDto } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.request.dto';
import { GetPaymentsGridResponseDto } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQueryGrid } from '@ui/hooks/useQueryGrid';

export const usePaymentGrid = (request: GetPaymentsGridRequestDto) =>
  useQueryGrid<GetPaymentsGridRequestDto, GetPaymentsGridResponseDto>({
    methodName: MeteorMethodEnum.PaymentsGetGrid,
    request,
  });
