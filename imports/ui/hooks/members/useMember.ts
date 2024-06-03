import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetMemberRequest } from '@application/members/use-cases/get-member/get-member.request';
import { GetMemberResponse } from '@application/members/use-cases/get-member/get-member.response';
import { useQuery } from '@ui/hooks/useQuery';

export const useMember = (request?: GetMemberRequest) =>
  useQuery<GetMemberRequest, GetMemberResponse>({
    methodName: MeteorMethodEnum.MembersGetOne,
    request,
  });
