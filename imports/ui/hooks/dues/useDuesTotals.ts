import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetDuesTotalsRequestDto } from '@adapters/dtos/get-dues-totals-request.dto';
import { GetDuesTotalsResponse } from '@domain/dues/due.repository';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useDuesTotals = (request: GetDuesTotalsRequestDto) =>
  useQuery<GetDuesTotalsRequestDto, GetDuesTotalsResponse>({
    methodName: MeteorMethodEnum.DuesGetTotals,
    request,
  });
