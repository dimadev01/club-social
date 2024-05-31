import { GetModelRequest } from '@domain/common/get-model.request';
import { MemberStatusEnum } from '@domain/members/member.enum';
import { CreateMemberRequest } from '@domain/members/use-cases/create-member/create-member.request';

export interface UpdateMemberRequest
  extends CreateMemberRequest,
    GetModelRequest {
  status: MemberStatusEnum;
}
