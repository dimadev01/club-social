import { MemberCategory, MemberStatus } from '@domain/members/member.enum';

export class GetMembersDto {
  _id: string;

  name: string;

  category: MemberCategory;

  status: MemberStatus;
}
