import { Decimal } from '@prisma/client/runtime/client';

export interface UpdatePaymentParams {
  amount: Decimal;
  date: Date;
  id: string;
  notes: null | string;
  updatedBy: string;
}
