import { GetPaymentsGridRequestDto } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { GetPaymentsGridResponseDto } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.response.dto';
import { useQueryGrid } from '../useQueryGrid';

export const usePaymentGrid = (request: GetPaymentsGridRequestDto) =>
  useQueryGrid<GetPaymentsGridRequestDto, GetPaymentsGridResponseDto>(
    MethodsEnum.PaymentsGetGrid,
    request,
  );
