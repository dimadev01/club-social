import { MemberDto } from '@application/members/dtos/member.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useMember = (request?: GetOneByIdRequestDto) =>
  useQuery<GetOneByIdRequestDto, MemberDto>({
    methodName: MeteorMethodEnum.MembersGetOne,
    request,
  });
