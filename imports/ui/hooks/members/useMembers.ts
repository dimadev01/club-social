import { MemberModelDto } from '@domain/members/use-cases/get-member/get-member.response';

import { GetMembersRequestDto } from '@infra/controllers/member/get-members-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@ui/hooks/useQuery';

export const useMembers = (request: GetMembersRequestDto = {}) =>
  useQuery<GetMembersRequestDto, MemberModelDto[]>({
    methodName: MeteorMethodEnum.MembersGet,
    request,
  });
