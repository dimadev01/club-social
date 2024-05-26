import { useMutation } from '@tanstack/react-query';

import { MigrateMovementRequestDto } from '@domain/movements/use-cases/migrate-movement/migrate-movement-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useMigrateMovement = () =>
  useMutation<null, Error, MigrateMovementRequestDto>(
    [MethodsEnum.MovementsMigrate],
    (request) => Meteor.callAsync(MethodsEnum.MovementsMigrate, request),
  );
