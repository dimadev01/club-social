import { MemberCategory } from '@domain/members/members.enum';

export class GetMembersDto {
  _id: string;

  name: string;

  category: MemberCategory;
}
