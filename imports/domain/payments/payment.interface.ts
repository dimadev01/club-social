import { IModel } from '@domain/common/models/model.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export interface IPayment extends IModel {
  date: DateUtcVo;
  memberId: string;
  notes: string | null;
  receiptNumber: number | null;
  status: PaymentStatusEnum;
}

export interface CreatePayment {
  date: DateUtcVo;
  memberId: string;
  notes: string | null;
  receiptNumber: number;
}

export interface IPaymentDue extends IModel {
  amount: Money;
  dueId: string;
  paymentId: string;
}

export interface CreatePaymentDue {
  amount: Money;
  dueId: string;
  paymentId: string;
}
