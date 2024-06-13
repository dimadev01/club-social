import { MemberDto } from '@application/members/dtos/member.dto';
import { PaymentDueDto } from '@application/payments/dtos/payment-due.dto';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export interface PaymentDto {
  amount: number;
  createdAt: string;
  date: string;
  dues: PaymentDueDto[];
  id: string;
  member?: MemberDto;
  memberId: string;
  notes: string | null;
  receiptNumber: number | null;
  status: PaymentStatusEnum;
  voidReason: string | null;
  voidedAt: string | null;
  voidedBy: string | null;
}
