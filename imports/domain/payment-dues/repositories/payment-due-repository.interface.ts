import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { PaymentDueModel } from '@domain/payment-dues/models/payment-due.model';

export interface IPaymentDueRepository<TSession = unknown>
  extends ICrudRepository<PaymentDueModel, TSession> {
  findByPayment(paymentId: string): Promise<PaymentDueModel[]>;
  findByPayments(paymentIds: string[]): Promise<PaymentDueModel[]>;
}
