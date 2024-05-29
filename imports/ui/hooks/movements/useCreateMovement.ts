import { useMutation } from '@tanstack/react-query';

import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { CreateMovementResponseDto } from '@domain/movements/use-cases/create-movement/create-movement-response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useCreateMovement = () =>
  useMutation<CreateMovementResponseDto, Error, CreateMovementRequestDto>(
    [MeteorMethodEnum.MovementsCreate],
    (request) => Meteor.callAsync(MeteorMethodEnum.MovementsCreate, request),
  );
