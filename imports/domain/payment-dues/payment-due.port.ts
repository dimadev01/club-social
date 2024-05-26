import { PaymentDue } from './entities/payment-due.entity';

import { ICrudPort } from '@application/ports/crud.port';

export type IPaymentDuePort = ICrudPort<PaymentDue>;
