import { DueCategoryEnum } from '@domain/dues/due.enum';
import { MemberCategoryEnum } from '@domain/members/member.enum';

export interface PriceGridDto {
  amount: number;
  dueCategory: DueCategoryEnum;
  memberCategory: MemberCategoryEnum;
  updatedAt: string;
  updatedBy: string;
}
