import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

export interface CreatePaymentProps {
  createdBy: string;
  date: DateOnly;
  dueIds: UniqueId[];
  memberId: UniqueId;
  notes: null | string;
  receiptNumber: null | string;
}

export interface PaymentDueProps {
  amount: Amount;
  dueId: UniqueId;
}

export interface VoidPaymentProps {
  voidedBy: string;
  voidReason: string;
}
