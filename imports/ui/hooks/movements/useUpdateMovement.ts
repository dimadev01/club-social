import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { UpdateMovementRequestDto } from '@domain/movements/use-cases/update-movement/update-movement-request.dto';

export const useUpdateMovement = () =>
  useMutation<null, Error, UpdateMovementRequestDto>(
    [MeteorMethodEnum.MovementsUpdate],
    (request) => Meteor.callAsync(MeteorMethodEnum.MovementsUpdate, request),
  );
