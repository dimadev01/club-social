import { DueDto } from '@application/dues/dtos/due.dto';
import { MemberDto } from '@application/members/dtos/member.dto';

export interface PaymentDto {
  date: string;
  dues?: PaymentDueDto[];
  id: string;
  member?: MemberDto;
  memberId: string;
  notes: string | null;
  receiptNumber: number | null;
}

export interface PaymentDueDto {
  amount: number;
  due?: DueDto;
  dueId: string;
}
