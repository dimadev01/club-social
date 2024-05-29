import { useMutation } from '@tanstack/react-query';

import { RestoreMovementRequestDto } from '@domain/movements/use-cases/restore-movement/restore-movement-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useRestoreMovement = (onSuccess: () => void) =>
  useMutation<null, Error, RestoreMovementRequestDto>(
    [MeteorMethodEnum.MovementsRestore],
    (request) => Meteor.callAsync(MeteorMethodEnum.MovementsRestore, request),
    { onSuccess: () => onSuccess() },
  );
