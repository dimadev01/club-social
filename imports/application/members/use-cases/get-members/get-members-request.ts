import { MemberStatusEnum } from '@domain/members/member.enum';

export interface GetMembersRequest {
  status: MemberStatusEnum[] | null;
}
