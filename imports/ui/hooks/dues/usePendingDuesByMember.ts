import { DueDto } from '@application/dues/dtos/due.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetPendingDuesRequestDto } from '@ui/dtos/get-pending-dues-request.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const usePendingDuesByMember = (request?: GetPendingDuesRequestDto) =>
  useQuery<GetPendingDuesRequestDto, DueDto[]>({
    methodName: MeteorMethodEnum.DuesGetPending,
    request,
  });
