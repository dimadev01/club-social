import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { CreateMovementResponseDto } from '@domain/movements/use-cases/create-movement/create-movement-response.dto';

export const useCreateMovement = () =>
  useMutation<CreateMovementResponseDto, Error, CreateMovementRequestDto>(
    [MeteorMethodEnum.MovementsCreate],
    (request) => Meteor.callAsync(MeteorMethodEnum.MovementsCreate, request),
  );
