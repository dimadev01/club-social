import { MemberCategory, MemberStatus } from '@domain/members/members.enum';

export class GetMembersDto {
  _id: string;

  name: string;

  category: MemberCategory;

  status: MemberStatus;
}
