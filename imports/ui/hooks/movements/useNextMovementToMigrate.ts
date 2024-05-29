import { useQuery } from '@tanstack/react-query';

import { GetNextMovementRequestDto } from '@domain/movements/use-cases/get-next-movement/get-next-movement-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useNextMovementToMigrate = (id?: string) =>
  useQuery<GetNextMovementRequestDto, Error, string | null>(
    [MeteorMethodEnum.MovementsGetNextToMigrate, id],
    () => Meteor.callAsync(MeteorMethodEnum.MovementsGetNextToMigrate, { id }),
    { enabled: !!id },
  );
