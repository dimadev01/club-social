import { DueCategoryEnum } from '@domain/dues/due.enum';
import { PaymentDue } from '@domain/payments/entities/payment-due';
import { PaymentDueDue } from '@domain/payments/entities/payment-due-due';
import { PaymentMember } from '@domain/payments/entities/payment-member';

export interface CreatePayment {
  date: string;
  dues: PaymentDue[];
  member: PaymentMember;
  notes: string | null;
}

export interface CreatePaymentDue {
  amount: number;
  due: PaymentDueDue;
}

export interface CreatePaymentDueDue {
  amount: number;
  category: DueCategoryEnum;
  date: Date;
  dueId: string;
}

export interface CreatePaymentMember {
  memberId: string;
  name: string;
}
