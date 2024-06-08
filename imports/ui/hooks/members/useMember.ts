import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { MemberDto } from '@application/members/dtos/member.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useMember = (request?: GetOneByIdRequestDto) =>
  useQuery<GetOneByIdRequestDto, MemberDto>({
    methodName: MeteorMethodEnum.MembersGetOne,
    request,
  });
