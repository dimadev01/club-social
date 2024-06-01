import { MemberModelDto } from '@domain/members/use-cases/get-member/get-member.response';

import { GetModelRequestDto } from '@infra/controllers/common/get-model-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@ui/hooks/useQuery';

export const useMember = (request?: GetModelRequestDto) =>
  useQuery<GetModelRequestDto, MemberModelDto | null>({
    methodName: MeteorMethodEnum.MembersGetOne,
    request,
  });
