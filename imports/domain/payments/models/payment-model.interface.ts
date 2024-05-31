import { IModel } from '@domain/common/models/model.interface';
import { DayjsDate } from '@domain/common/value-objects/dayjs-date.value-object';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export interface CreatePayment {
  date: DayjsDate;
  memberId: string;
  notes: string | null;
  receiptNumber: number;
}

export interface IPaymentModel extends IModel {
  date: DayjsDate;
  memberId: string;
  notes: string | null;
  receiptNumber: number | null;
  status: PaymentStatusEnum;
}
