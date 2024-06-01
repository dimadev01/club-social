import { GetModelRequestDto } from '@adapters/common/dtos/get-model-request.dto';
import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { MemberModelDto } from '@application/members/dtos/member-model-dto';
import { useQuery } from '@ui/hooks/useQuery';

export const useMember = (request?: GetModelRequestDto) =>
  useQuery<GetModelRequestDto, MemberModelDto | null>({
    methodName: MeteorMethodEnum.MembersGetOne,
    request,
  });
