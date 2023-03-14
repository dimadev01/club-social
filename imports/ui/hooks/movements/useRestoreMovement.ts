import { RestoreMovementRequestDto } from '@domain/movements/use-cases/restore-movement/restore-movement-request.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useRestoreMovement = (onSuccess: () => void) =>
  useMutation<undefined, Error, RestoreMovementRequestDto>(
    [MethodsEnum.MovementsRestore],
    (request) => Meteor.callAsync(MethodsEnum.MovementsRestore, request),
    { onSuccess }
  );
