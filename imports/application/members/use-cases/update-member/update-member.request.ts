import { FindOneById } from '@application/common/repositories/queryable.repository';
import { CreateMemberRequest } from '@application/members/use-cases/create-member/create-member.request';
import { MemberStatusEnum } from '@domain/members/member.enum';

export interface UpdateMemberRequest extends CreateMemberRequest, FindOneById {
  status: MemberStatusEnum;
}
