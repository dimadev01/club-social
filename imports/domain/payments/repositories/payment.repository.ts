import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { IGridRepository } from '@domain/common/repositories/grid.repository';
import { PaymentModel } from '@domain/payments/models/payment.model';
import { FindPaginatedPaymentsRequest } from '@domain/payments/repositories/payment-repository.types';

export interface IPaymentRepository<TSession = unknown>
  extends ICrudRepository<PaymentModel, TSession>,
    IGridRepository<PaymentModel, FindPaginatedPaymentsRequest> {
  findOneByReceipt(receiptNumber: number): Promise<PaymentModel | null>;
}
