import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { DeleteMovementRequestDto } from '@domain/movements/use-cases/delete-movement/delete-movement-request.dto';

export const useDeleteMovement = (onSuccess: () => void) =>
  useMutation<null, Error, DeleteMovementRequestDto>(
    [MeteorMethodEnum.MovementsDelete],
    (request) => Meteor.callAsync(MeteorMethodEnum.MovementsDelete, request),
    { onSuccess: () => onSuccess() },
  );
