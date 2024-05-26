import { ICrudPort } from '@application/ports/crud.port';
import { PaymentDue } from './entities/payment-due.entity';

export type IPaymentDuePort = ICrudPort<PaymentDue>;
