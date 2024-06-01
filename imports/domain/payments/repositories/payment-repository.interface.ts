import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';
import { IQueryableGridRepository } from '@domain/common/repositories/queryable-grid-repository.interface';
import { PaymentModel } from '@domain/payments/models/payment.model';
import { FindPaginatedPaymentsRequest } from '@domain/payments/repositories/find-paginated-payments.interface';

export interface IPaymentRepository<TSession = unknown>
  extends ICrudRepository<PaymentModel, TSession>,
    IQueryableGridRepository<PaymentModel, FindPaginatedPaymentsRequest> {}
