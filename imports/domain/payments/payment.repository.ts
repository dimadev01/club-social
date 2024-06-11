import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  IGridRepository,
} from '@domain/common/repositories/grid.repository';
import { Payment } from '@domain/payments/models/payment.model';

export interface IPaymentRepository
  extends ICrudRepository<Payment>,
    IGridRepository<Payment, FindPaginatedPaymentsRequest> {
  findOneByReceipt(receiptNumber: number): Promise<Payment | null>;
  getTotals(
    request: FindPaginatedPaymentsFilters,
  ): Promise<GetPaymentsTotalsResponse>;
}

export interface FindPaginatedPaymentsRequest
  extends FindPaginatedPaymentsFilters,
    FindPaginatedRequest {}

export interface FindPaginatedPaymentsFilters {
  filterByFrom: string | null;
  filterByMember: string[];
  filterByStatus: string[];
  filterByTo: string | null;
}

export interface GetPaymentsTotalsResponse {
  amount: number;
}

export type FindPaginatedPaymentsResponse = FindPaginatedResponse<Payment>;
