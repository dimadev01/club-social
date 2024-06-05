import { GetPendingDuesRequest } from '@application/dues/use-cases/get-pending-dues/get-pending-dues.request';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { DueDto } from '@application/dues/dtos/due.dto';
import { useQuery } from '@ui/hooks/useQuery';

export const usePendingDuesByMember = (request?: GetPendingDuesRequest) =>
  useQuery<GetPendingDuesRequest, DueDto[]>({
    methodName: MeteorMethodEnum.DuesGetPending,
    request,
  });
