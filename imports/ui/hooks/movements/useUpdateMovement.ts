import { UpdateMovementRequestDto } from '@domain/movements/use-cases/update-movement/update-movement-request.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useUpdateMovement = () =>
  useMutation<undefined, Error, UpdateMovementRequestDto>(
    [MethodsEnum.MovementsUpdate],
    (request) => Meteor.callAsync(MethodsEnum.MovementsUpdate, request)
  );
