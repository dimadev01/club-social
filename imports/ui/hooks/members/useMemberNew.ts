import { GetMemberResponse } from '@domain/members/use-cases/get-member-new/get-member.response';
import { GetMemberRequestDto } from '@infra/controllers/types/get-member-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@ui/hooks/useQuery';

export const useMemberNew = (request?: GetMemberRequestDto) =>
  useQuery<GetMemberRequestDto, GetMemberResponse | null>({
    methodName: MethodsEnum.MembersGetNew,
    request,
  });
