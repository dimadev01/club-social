import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetPendingDuesRequestDto } from '@adapters/dtos/get-pending-dues-request.dto';
import { DueDto } from '@application/dues/dtos/due.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const usePendingDuesByMember = (request?: GetPendingDuesRequestDto) =>
  useQuery<GetPendingDuesRequestDto, DueDto[]>({
    methodName: MeteorMethodEnum.DuesGetPending,
    request,
  });
