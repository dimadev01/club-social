import { MemberCategoryEnum } from '@domain/members/member.enum';

export interface PriceCategoryDto {
  amount: number;
  category: MemberCategoryEnum;
}
