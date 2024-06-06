import { IModel } from '@domain/common/models/model.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';

export interface IDue extends IModel {
  amount: Money;
  balanceAmount: Money;
  category: DueCategoryEnum;
  date: DateUtcVo;
  memberId: string;
  notes: string | null;
  payments: IDuePayment[];
  status: DueStatusEnum;
  totalPaidAmount: Money;
}

export interface CreateDue {
  amount: Money;
  category: DueCategoryEnum;
  date: DateUtcVo;
  memberId: string;
  notes: string | null;
}

export interface IDuePayment {
  amount: Money;
  date: DateUtcVo;
  paymentId: string;
  receiptNumber: number | null;
}

export interface CreateDuePayment {
  amount: Money;
  date: DateUtcVo;
  paymentId: string;
  receiptNumber: number | null;
}
