import { UpdateMovementRequestDto } from '@domain/movements/use-cases/update-movement/update-movement-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useUpdateMovement = () =>
  useMutation<null, Error, UpdateMovementRequestDto>(
    [MethodsEnum.MovementsUpdate],
    (request) => Meteor.callAsync(MethodsEnum.MovementsUpdate, request),
  );
