import { useMutation } from '@tanstack/react-query';

import { UpdateMovementRequestDto } from '@domain/movements/use-cases/update-movement/update-movement-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useUpdateMovement = () =>
  useMutation<null, Error, UpdateMovementRequestDto>(
    [MeteorMethodEnum.MovementsUpdate],
    (request) => Meteor.callAsync(MeteorMethodEnum.MovementsUpdate, request),
  );
