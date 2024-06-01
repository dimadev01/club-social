import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetMovementRequestDto } from '@domain/movements/use-cases/get-movement/get-movement-request.dto';
import { GetMovementResponseDto } from '@domain/movements/use-cases/get-movement/get-movement-response.dto';

export const useMovement = (id?: string) =>
  useQuery<GetMovementRequestDto, Error, GetMovementResponseDto | undefined>(
    [MeteorMethodEnum.MovementsGet, id],
    () => Meteor.callAsync(MeteorMethodEnum.MovementsGet, { id }),
    { enabled: !!id },
  );
