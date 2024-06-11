import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetMovementsTotalsRequestDto } from '@adapters/dtos/get-movements-totals-request.dto';
import { GetMovementsTotalsResponse } from '@domain/movements/movement.repository';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useMovementsTotals = (request: GetMovementsTotalsRequestDto) =>
  useQuery<GetMovementsTotalsRequestDto, GetMovementsTotalsResponse>({
    methodName: MeteorMethodEnum.MovementsGetTotals,
    request,
  });
