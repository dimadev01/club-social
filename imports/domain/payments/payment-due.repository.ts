import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { PaymentDue } from '@domain/payments/models/payment-due.model';

export interface IPaymentDueRepository extends ICrudRepository<PaymentDue> {
  findByDue(request: FindPaymentDueByDue): Promise<PaymentDue[]>;
  findByPayment(request: FindPaymentDueByPayment): Promise<PaymentDue[]>;
  findByPayments(paymentIds: string[]): Promise<PaymentDue[]>;
  findOneByDue(dueId: string): Promise<PaymentDue | null>;
}

export interface FindPaymentDueByPayment {
  paymentId: string;
}

export interface FindPaymentDueByDue {
  dueId: string;
}
