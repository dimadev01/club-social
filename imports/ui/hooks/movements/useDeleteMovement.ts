import { DeleteMovementRequestDto } from '@domain/movements/use-cases/delete-movement/delete-movement-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useDeleteMovement = (onSuccess: () => void) =>
  useMutation<null, Error, DeleteMovementRequestDto>(
    [MethodsEnum.MovementsDelete],
    (request) => Meteor.callAsync(MethodsEnum.MovementsDelete, request),
    { onSuccess }
  );
