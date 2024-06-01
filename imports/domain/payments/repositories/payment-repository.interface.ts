import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';

import { IGridRepository } from '@domain/common/repositories/grid.repository';
import { PaymentModel } from '@domain/payments/models/payment.model';
import { FindPaginatedPaymentsRequest } from '@domain/payments/repositories/find-paginated-payments.interface';

export interface IPaymentRepository<TSession = unknown>
  extends ICrudRepository<PaymentModel, TSession>,
    IGridRepository<PaymentModel, FindPaginatedPaymentsRequest> {}
