import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetMembersRequestDto } from '@adapters/dtos/get-members-request.dto';
import { MemberDto } from '@application/members/dtos/member.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useMembers = (request?: GetMembersRequestDto) =>
  useQuery<GetMembersRequestDto, MemberDto[]>({
    methodName: MeteorMethodEnum.MembersGet,
    request: request || {},
  });
