import { DuePaymentDto } from '@application/dues/dtos/due-payment.dto';
import { MemberDto } from '@application/members/dtos/member.dto';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';

export interface DueDto {
  amount: number;
  category: DueCategoryEnum;
  date: string;
  id: string;
  member?: MemberDto;
  memberId: string;
  notes: string | null;
  payments: DuePaymentDto[];
  status: DueStatusEnum;
  totalPaidAmount: number;
  totalPendingAmount: number;
}
