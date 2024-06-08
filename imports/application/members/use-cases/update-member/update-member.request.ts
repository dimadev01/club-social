import { CreateMemberRequest } from '@application/members/use-cases/create-member/create-member.request';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { MemberStatusEnum } from '@domain/members/member.enum';

export interface UpdateMemberRequest extends CreateMemberRequest, FindOneById {
  status: MemberStatusEnum;
}
