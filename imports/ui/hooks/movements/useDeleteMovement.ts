import { useMutation } from '@tanstack/react-query';

import { DeleteMovementRequestDto } from '@domain/movements/use-cases/delete-movement/delete-movement-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useDeleteMovement = (onSuccess: () => void) =>
  useMutation<null, Error, DeleteMovementRequestDto>(
    [MeteorMethodEnum.MovementsDelete],
    (request) => Meteor.callAsync(MeteorMethodEnum.MovementsDelete, request),
    { onSuccess: () => onSuccess() },
  );
