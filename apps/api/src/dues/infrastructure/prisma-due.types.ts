import {
  DueModel,
  PaymentDueModel,
} from '@/infrastructure/database/prisma/generated/models';
import { MemberModelWithRelations } from '@/payments/infrastructure/prisma-payment.types';

export type DueModelWithRelations = DueModel & {
  member?: MemberModelWithRelations;
  paymentDues?: PaymentDueModel[];
};
