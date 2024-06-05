import { GetOneDtoByIdRequestDto } from '@adapters/dtos/get-one-dto-request.dto';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { MemberDto } from '@application/members/dtos/member.dto';
import { useQuery } from '@ui/hooks/useQuery';

export const useMember = (request?: GetOneDtoByIdRequestDto) =>
  useQuery<GetOneDtoByIdRequestDto, MemberDto>({
    methodName: MeteorMethodEnum.MembersGetOne,
    request,
  });
