import { MemberDto } from '@application/members/dtos/member.dto';
import { PaymentDueDto } from '@application/payments/dtos/payment-due.dto';

export interface PaymentDto {
  date: string;
  dues?: PaymentDueDto[];
  id: string;
  member?: MemberDto;
  memberId: string;
  notes: string | null;
  receiptNumber: number | null;
}
