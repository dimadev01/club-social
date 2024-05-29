import { useMutation } from '@tanstack/react-query';

import { MigrateMovementRequestDto } from '@domain/movements/use-cases/migrate-movement/migrate-movement-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useMigrateMovement = () =>
  useMutation<null, Error, MigrateMovementRequestDto>(
    [MeteorMethodEnum.MovementsMigrate],
    (request) => Meteor.callAsync(MeteorMethodEnum.MovementsMigrate, request),
  );
