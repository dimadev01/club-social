import { MemberDto } from '@application/members/dtos/member.dto';
import { PaymentDueDto } from '@application/payments/dtos/payment.dto';

export interface PaymentGridDto {
  date: string;
  id: string;
  member: MemberDto;
  memberId: string;
  paymentDues: PaymentDueDto[];
  paymentDuesCount: number;
  receiptNumber: number | null;
  totalAmount: number;
}
