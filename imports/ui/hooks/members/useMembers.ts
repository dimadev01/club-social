import { MemberDto } from '@application/members/dtos/member.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetMembersRequestDto } from '@ui/dtos/get-members-request.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useMembers = (request?: GetMembersRequestDto) =>
  useQuery<GetMembersRequestDto, MemberDto[]>({
    methodName: MeteorMethodEnum.MembersGet,
    request: request || {},
  });
