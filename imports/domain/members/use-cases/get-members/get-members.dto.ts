import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export class GetMembersDto {
  _id: string;

  name: string;

  category: MemberCategoryEnum;

  status: MemberStatusEnum;
}
