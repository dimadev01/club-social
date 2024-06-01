import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { MigrateMovementRequestDto } from '@domain/movements/use-cases/migrate-movement/migrate-movement-request.dto';

export const useMigrateMovement = () =>
  useMutation<null, Error, MigrateMovementRequestDto>(
    [MeteorMethodEnum.MovementsMigrate],
    (request) => Meteor.callAsync(MeteorMethodEnum.MovementsMigrate, request),
  );
