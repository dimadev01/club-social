import { ICrudRepository } from '@application/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  IGridRepository,
} from '@application/common/repositories/grid.repository';
import { Payment } from '@domain/payments/models/payment.model';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

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
  filterByCreatedAt: string[];
  filterByDate: string[];
  filterByMember: string[];
  filterByStatus: PaymentStatusEnum[];
}

export interface GetPaymentsTotalsResponse {
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}

export type FindPaginatedPaymentsResponse = FindPaginatedResponse<Payment>;
