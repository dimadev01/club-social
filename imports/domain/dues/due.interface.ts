import { IModel } from '@domain/common/models/model.interface';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import {
  PaymentDueSourceEnum,
  PaymentStatusEnum,
} from '@domain/payments/payment.enum';

export interface IDue extends IModel {
  amount: Money;
  category: DueCategoryEnum;
  date: DateVo;
  memberId: string;
  notes: string | null;
  payments: IDuePayment[];
  status: DueStatusEnum;
  totalPaidAmount: Money;
  totalPendingAmount: Money;
  voidReason: string | null;
  voidedAt: DateVo | null;
  voidedBy: string | null;
}

export interface CreateDue {
  amount: Money;
  category: DueCategoryEnum;
  date: DateVo;
  memberId: string;
  notes: string | null;
}

export interface IDuePayment {
  creditAmount: Money;
  directAmount: Money;
  paymentDate: DateVo;
  paymentId: string;
  paymentReceiptNumber: number | null;
  paymentStatus: PaymentStatusEnum;
  source: PaymentDueSourceEnum;
  totalAmount: Money;
}

export interface CreateDuePayment {
  creditAmount: Money;
  date: DateVo;
  directAmount: Money;
  paymentId: string;
  receiptNumber: number | null;
  source: PaymentDueSourceEnum;
  totalAmount: Money;
}
