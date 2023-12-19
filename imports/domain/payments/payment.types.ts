import { DueCategoryEnum } from '@domain/dues/due.enum';
import { PaymentDue } from '@domain/payments/entities/payment-due';
import { PaymentMember } from '@domain/payments/entities/payment-member';

export interface CreatePayment {
  date: string;
  dues: PaymentDue[];
  member: PaymentMember;
  notes: string | null;
}

export interface CreatePaymentDue {
  _id: string;
  amount: number;
  category: DueCategoryEnum;
  date: Date;
}

export interface CreatePaymentMember {
  _id: string;
  name: string;
}
