import { GetMemberResponse } from '@domain/members/use-cases/get-member/get-member.response';
import { GetMemberRequestDto } from '@infra/controllers/types/get-member-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@ui/hooks/useQuery';

export const useMember = (request?: GetMemberRequestDto) =>
  useQuery<GetMemberRequestDto, GetMemberResponse | null>({
    methodName: MeteorMethodEnum.MembersGetOne,
    request,
  });
