import { MemberStatusEnum } from '@domain/members/member.enum';
import { CreateMemberRequest } from '@domain/members/use-cases/create-member-new/create-member.request';

export interface UpdateMemberRequest extends CreateMemberRequest {
  id: string;
  status: MemberStatusEnum;
}
