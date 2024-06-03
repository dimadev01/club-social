import { MemberDto } from '@application/members/dtos/member.dto';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';

export interface DueDto {
  amount: number;
  category: DueCategoryEnum;
  date: string;
  id: string;
  member: MemberDto | undefined;
  memberId: string;
  notes: string | null;
  paymentId: string | undefined;
  status: DueStatusEnum;
}
