import { IModel } from '@domain/common/models/model.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import {
  PaymentDueSourceEnum,
  PaymentStatusEnum,
} from '@domain/payments/payment.enum';

export interface IDue extends IModel {
  amount: Money;
  category: DueCategoryEnum;
  date: DateUtcVo;
  memberId: string;
  notes: string | null;
  payments: IDuePayment[];
  status: DueStatusEnum;
  totalPaidAmount: Money;
  totalPendingAmount: Money;
  voidReason: string | null;
  voidedAt: DateUtcVo | null;
  voidedBy: string | null;
}

export interface CreateDue {
  amount: Money;
  category: DueCategoryEnum;
  date: DateUtcVo;
  memberId: string;
  notes: string | null;
}

export interface IDuePayment {
  creditAmount: Money;
  directAmount: Money;
  paymentDate: DateUtcVo;
  paymentId: string;
  paymentReceiptNumber: number | null;
  paymentStatus: PaymentStatusEnum;
  source: PaymentDueSourceEnum;
  totalAmount: Money;
}

export interface CreateDuePayment {
  creditAmount: Money;
  date: DateUtcVo;
  directAmount: Money;
  paymentId: string;
  receiptNumber: number | null;
  source: PaymentDueSourceEnum;
  totalAmount: Money;
}
