import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';
import {
  FindPaginatedRequest,
  IQueryableGridRepository,
} from '@domain/common/repositories/queryable-grid-repository.interface';
import { PaymentModel } from '@domain/payments/models/payment.model';

export interface IPaymentRepository<TSession = unknown>
  extends ICrudRepository<PaymentModel, TSession>,
    IQueryableGridRepository<PaymentModel, GetPaymentsGridRequest> {}

export type GetPaymentsGridRequest = FindPaginatedRequest;
