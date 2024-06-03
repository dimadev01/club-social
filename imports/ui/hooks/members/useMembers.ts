import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetMembersRequest } from '@application/members/use-cases/get-members/get-members.request';
import { GetMembersResponse } from '@application/members/use-cases/get-members/get-members.response';
import { useQuery } from '@ui/hooks/useQuery';

export const useMembers = (request: GetMembersRequest = {}) =>
  useQuery<GetMembersRequest, GetMembersResponse>({
    methodName: MeteorMethodEnum.MembersGet,
    request,
  });
