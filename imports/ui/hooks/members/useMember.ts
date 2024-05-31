import { GetMemberResponse } from '@domain/members/use-cases/get-member/get-member.response';
import { GetModelRequestDto } from '@infra/controllers/types/get-model-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@ui/hooks/useQuery';

export const useMember = (request?: GetModelRequestDto) =>
  useQuery<GetModelRequestDto, GetMemberResponse | null>({
    methodName: MeteorMethodEnum.MembersGetOne,
    request,
  });
