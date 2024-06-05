import { GetDueRequest } from '@application/dues/use-cases/get-due/get-due.request';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { DueDto } from '@application/dues/dtos/due.dto';
import { useQuery } from '@ui/hooks/useQuery';

export const useDue = (request?: GetDueRequest) =>
  useQuery<GetDueRequest, DueDto>({
    methodName: MeteorMethodEnum.DuesGet,
    request,
  });
