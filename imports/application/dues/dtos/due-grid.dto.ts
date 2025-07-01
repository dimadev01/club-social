import { DuePaymentDto } from '@application/dues/dtos/due-payment.dto';
import { MemberDto } from '@application/members/dtos/member.dto';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { MemberStatusEnum } from '@domain/members/member.enum';

export interface DueGridDto {
  amount: number;
  category: DueCategoryEnum;
  createdAt: string;
  date: string;
  id: string;
  isPayable: boolean;
  member: MemberDto;
  memberId: string;
  memberStatus: MemberStatusEnum;
  payments: DuePaymentDto[];
  status: DueStatusEnum;
  totalPaidAmount: number;
  totalPendingAmount: number;
}
