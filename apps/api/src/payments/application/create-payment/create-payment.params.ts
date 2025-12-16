import { Decimal } from '@prisma/client/runtime/client';

export interface CreatePaymentParams {
  amount: Decimal;
  createdBy: string;
  date: Date;
  dueId: string;
  notes: null | string;
}
