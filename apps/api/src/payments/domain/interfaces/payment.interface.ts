import { Decimal } from '@prisma/client/runtime/client';

export interface UpdatePaymentProps {
  amount: Decimal;
  date: Date;
  notes: null | string;
  updatedBy: string;
}
