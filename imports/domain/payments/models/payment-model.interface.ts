import { IModelProps } from '@domain/common/models/model.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { MemberModel } from '@domain/members/models/member.model';
import { PaymentDueModel } from '@domain/payment-dues/models/payment-due.model';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export interface IPaymentProps extends IModelProps {
  date: DateUtcVo;
  dues?: PaymentDueModel[];
  member?: MemberModel;
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

export interface CreatePaymentDue {
  amount: number;
  dueId: string;
}
