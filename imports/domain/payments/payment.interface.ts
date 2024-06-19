import { IModel } from '@domain/common/models/model.interface';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import {
  PaymentDueSourceEnum,
  PaymentStatusEnum,
} from '@domain/payments/payment.enum';

export interface IPayment extends IModel {
  amount: Money;
  date: DateVo;
  dues: IPaymentDue[];
  memberId: string;
  notes: string | null;
  receiptNumber: number | null;
  status: PaymentStatusEnum;
  voidReason: string | null;
  voidedAt: DateVo | null;
  voidedBy: string | null;
}

export interface CreatePayment {
  createDues: CreatePaymentDue[];
  date: DateVo;
  memberId: string;
  notes: string | null;
  receiptNumber: number;
}

export interface IPaymentDue {
  creditAmount: Money;
  directAmount: Money;
  dueAmount: Money;
  dueCategory: DueCategoryEnum;
  dueDate: DateVo;
  dueId: string;
  duePendingAmount: Money;
  source: PaymentDueSourceEnum;
  totalAmount: Money;
}

export interface CreatePaymentDue {
  creditAmount: Money;
  directAmount: Money;
  dueAmount: Money;
  dueCategory: DueCategoryEnum;
  dueDate: DateVo;
  dueId: string;
  duePendingAmount: Money;
}
