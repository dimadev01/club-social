import { GetModelRequestDto } from '@adapters/common/dtos/get-model-request.dto';
import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { useQuery } from '@adapters/ui/hooks/useQuery';
import { MemberModelDto } from '@application/members/dtos/member-model-dto';

export const useMember = (request?: GetModelRequestDto) =>
  useQuery<GetModelRequestDto, MemberModelDto | null>({
    methodName: MeteorMethodEnum.MembersGetOne,
    request,
  });
