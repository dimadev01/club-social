import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { IGridRepository } from '@domain/common/repositories/grid.repository';
import { Payment } from '@domain/payments/models/payment.model';
import { FindPaginatedPaymentsRequest } from '@domain/payments/repositories/payment-repository.types';

export interface IPaymentRepository<TSession = unknown>
  extends ICrudRepository<Payment, TSession>,
    IGridRepository<Payment, FindPaginatedPaymentsRequest> {
  findOneByReceipt(receiptNumber: number): Promise<Payment | null>;
}
