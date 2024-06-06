import { MemberDto } from '@application/members/dtos/member.dto';
import { PaymentDueDto } from '@application/payments/dtos/payment-due.dto';

export interface PaymentGridDto {
  amount: number;
  date: string;
  dues: PaymentDueDto[];
  duesCount: number;
  id: string;
  member: MemberDto;
  memberId: string;
  receiptNumber: number | null;
}
