import { PaymentDue } from './entities/payment-due.entity';

import { ICrudPort } from '@application/ports/crud.port';

export interface IPaymentDuePort extends ICrudPort<PaymentDue> {
  findByPayment(paymentId: string): Promise<PaymentDue[]>;
  findByPayments(paymentIds: string[]): Promise<PaymentDue[]>;
}
