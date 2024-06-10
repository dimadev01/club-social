import { MemberDto } from '@application/members/dtos/member.dto';
import { PaymentDueDto } from '@application/payments/dtos/payment-due.dto';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export interface PaymentGridDto {
  amount: number;
  createdAt: string;
  date: string;
  dues: PaymentDueDto[];
  duesCount: number;
  id: string;
  member: MemberDto;
  memberId: string;
  receiptNumber: number | null;
  status: PaymentStatusEnum;
}
