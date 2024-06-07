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
}

export interface FindPaginatedPaymentsRequest extends FindPaginatedRequest {
  filterByMember: string[];
  filterByStatus: string[];
}

export type FindPaginatedPaymentsResponse = FindPaginatedResponse<Payment>;
