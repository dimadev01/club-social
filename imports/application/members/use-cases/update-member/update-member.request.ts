import { CreateMemberRequest } from '@application/members/use-cases/create-member/create-member.request';
import { GetModelRequest } from '@domain/common/requests/get-model.request';
import { MemberStatusEnum } from '@domain/members/member.enum';

export interface UpdateMemberRequest
  extends CreateMemberRequest,
    GetModelRequest {
  status: MemberStatusEnum;
}
