import { MemberCategoryEnum } from '@domain/members/member.enum';

export interface PriceCategoryDto {
  amount: number;
  memberCategory: MemberCategoryEnum;
}
