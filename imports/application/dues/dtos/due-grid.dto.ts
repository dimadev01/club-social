import { MemberDto } from '@application/members/dtos/member.dto';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';

export interface DueGridDto {
  amount: number;
  category: DueCategoryEnum;
  date: string;
  id: string;
  member: MemberDto;
  memberId: string;
  pendingAmount: number;
  status: DueStatusEnum;
}
