import { GetMembersRequestDto } from '@adapters/members/dtos/get-members-request.dto';
import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { MemberModelDto } from '@application/members/dtos/member-model-dto';
import { useQuery } from '@ui/hooks/useQuery';

export const useMembers = (request: GetMembersRequestDto = {}) =>
  useQuery<GetMembersRequestDto, MemberModelDto[]>({
    methodName: MeteorMethodEnum.MembersGet,
    request,
  });
