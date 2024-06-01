import { GetMembersRequestDto } from '@adapters/members/dtos/get-members-request.dto';
import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { useQuery } from '@adapters/ui/hooks/useQuery';
import { MemberModelDto } from '@application/members/dtos/member-model-dto';

export const useMembers = (request: GetMembersRequestDto = {}) =>
  useQuery<GetMembersRequestDto, MemberModelDto[]>({
    methodName: MeteorMethodEnum.MembersGet,
    request,
  });
