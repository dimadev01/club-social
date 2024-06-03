import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetPendingDuesRequest } from '@application/dues/use-cases/get-pending-dues/get-pending-dues.request';
import { GetPendingDuesResponse } from '@application/dues/use-cases/get-pending-dues/get-pending-dues.response';
import { useQuery } from '@ui/hooks/useQuery';

export const usePendingDuesByMember = (request?: GetPendingDuesRequest) =>
  useQuery<GetPendingDuesRequest, GetPendingDuesResponse>({
    methodName: MeteorMethodEnum.DuesGetPending,
    request,
  });
