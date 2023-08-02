import { GetMovementRequestDto } from '@domain/movements/use-cases/get-movement/get-movement-request.dto';
import { GetMovementResponseDto } from '@domain/movements/use-cases/get-movement/get-movement-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useMovement = (id?: string) =>
  useQuery<GetMovementRequestDto, Error, GetMovementResponseDto | undefined>(
    [MethodsEnum.MovementsGet, id],
    () => Meteor.callAsync(MethodsEnum.MovementsGet, { id }),
    { enabled: !!id }
  );
