import { IModel } from '@domain/common/models/model.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { MemberModel } from '@domain/members/models/member.model';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export interface CreatePayment {
  date: DateUtcVo;
  memberId: string;
  notes: string | null;
  receiptNumber: number;
}

export interface IPaymentModel extends IModel {
  date: DateUtcVo;
  dues: PaymentDueModel[];
  member: MemberModel | undefined;
  memberId: string;
  notes: string | null;
  receiptNumber: number | null;
  status: PaymentStatusEnum;
}
