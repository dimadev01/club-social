import { IModel } from '@domain/common/models/model.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import {
  PaymentDueSourceEnum,
  PaymentStatusEnum,
} from '@domain/payments/payment.enum';

export interface IPayment extends IModel {
  amount: Money;
  date: DateUtcVo;
  dues: IPaymentDue[];
  memberId: string;
  notes: string | null;
  receiptNumber: number | null;
  status: PaymentStatusEnum;
  voidReason: string | null;
  voidedAt: DateUtcVo | null;
  voidedBy: string | null;
}

export interface CreatePayment {
  date: DateUtcVo;
  dues: CreatePaymentDue[];
  memberId: string;
  notes: string | null;
  receiptNumber: number;
}

export interface IPaymentDue {
  amount: Money;
  dueAmount: Money;
  dueCategory: DueCategoryEnum;
  dueDate: DateUtcVo;
  dueId: string;
  source: PaymentDueSourceEnum;
}

export interface CreatePaymentDue {
  amount: Money;
  dueAmount: Money;
  dueCategory: DueCategoryEnum;
  dueDate: DateUtcVo;
  dueId: string;
  source: PaymentDueSourceEnum;
}
