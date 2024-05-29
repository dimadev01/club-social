import { MemberCategoryEnum } from '@domain/members/member.enum';

export interface GetMemberGridResponse {
  _id: string;
  category: MemberCategoryEnum;
  name: string;
}
