import { GetMovementsTotalsResponse } from '@application/movements/repositories/movement.repository';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetMovementsTotalsRequestDto } from '@ui/dtos/get-movements-totals-request.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useMovementsTotals = (request: GetMovementsTotalsRequestDto) =>
  useQuery<GetMovementsTotalsRequestDto, GetMovementsTotalsResponse>({
    methodName: MeteorMethodEnum.MovementsGetTotals,
    request,
  });
