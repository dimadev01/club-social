import { PaymentDueOld } from './entities/payment-due.entity';

import { ICrudPort } from '@application/ports/crud.port';

export interface IPaymentDuePort extends ICrudPort<PaymentDueOld> {
  findByPayment(paymentId: string): Promise<PaymentDueOld[]>;
  findByPayments(paymentIds: string[]): Promise<PaymentDueOld[]>;
}
