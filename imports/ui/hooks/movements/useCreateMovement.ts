import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { CreateMovementResponseDto } from '@domain/movements/use-cases/create-movement/create-movement-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useCreateMovement = () =>
  useMutation<CreateMovementResponseDto, Error, CreateMovementRequestDto>(
    [MethodsEnum.MovementsCreate],
    (request) => Meteor.callAsync(MethodsEnum.MovementsCreate, request)
  );
