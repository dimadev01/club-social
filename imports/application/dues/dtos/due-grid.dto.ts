import { DuePaymentDto } from '@application/dues/dtos/due-payment.dto';
import { MemberDto } from '@application/members/dtos/member.dto';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';

export interface DueGridDto {
  amount: number;
  balanceAmount: number;
  category: DueCategoryEnum;
  date: string;
  id: string;
  member: MemberDto;
  memberId: string;
  payments: DuePaymentDto[];
  status: DueStatusEnum;
}
