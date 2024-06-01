import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { RestoreMovementRequestDto } from '@domain/movements/use-cases/restore-movement/restore-movement-request.dto';

export const useRestoreMovement = (onSuccess: () => void) =>
  useMutation<null, Error, RestoreMovementRequestDto>(
    [MeteorMethodEnum.MovementsRestore],
    (request) => Meteor.callAsync(MeteorMethodEnum.MovementsRestore, request),
    { onSuccess: () => onSuccess() },
  );
