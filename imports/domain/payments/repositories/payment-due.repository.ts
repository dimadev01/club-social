import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { PaymentDue } from '@domain/payments/models/payment-due.model';

export interface IPaymentDueRepository extends ICrudRepository<PaymentDue> {
  findByPayment(paymentId: string): Promise<PaymentDue[]>;
  findByPayments(paymentIds: string[]): Promise<PaymentDue[]>;
}
