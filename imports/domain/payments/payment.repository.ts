import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  IGridRepository,
} from '@domain/common/repositories/grid.repository';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { Payment } from '@domain/payments/models/payment.model';

export interface IPaymentRepository
  extends ICrudRepository<Payment>,
    IGridRepository<Payment, FindPaginatedPaymentsRequest> {
  findOneById(request: FindOnePaymentById): Promise<Payment | null>;
  findOneByReceipt(receiptNumber: number): Promise<Payment | null>;
}

export interface FindOnePaymentById extends FindOneById {
  fetchMember?: boolean;
  fetchPaymentDues?: boolean;
}

export interface FindPaginatedPaymentsRequest extends FindPaginatedRequest {
  filterByMember: string[];
}

export type FindPaginatedPaymentsResponse = FindPaginatedResponse<Payment>;
