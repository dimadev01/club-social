import { GetMemberAvailableCreditResponse } from '@application/members/use-cases/get-member-available-credit/get-member-available-credit.response';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useMemberCreditAvailable = (request?: GetOneByIdRequestDto) =>
  useQuery<GetOneByIdRequestDto, GetMemberAvailableCreditResponse>({
    methodName: MeteorMethodEnum.MembersCreditGetAvailable,
    request,
  });
