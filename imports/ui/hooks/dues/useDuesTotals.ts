import { GetDuesTotalsResponse } from '@application/dues/repositories/due.repository';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetDuesTotalsRequestDto } from '@ui/dtos/get-dues-totals-request.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useDuesTotals = (request: GetDuesTotalsRequestDto) =>
  useQuery<GetDuesTotalsRequestDto, GetDuesTotalsResponse>({
    methodName: MeteorMethodEnum.DuesGetTotals,
    request,
  });
