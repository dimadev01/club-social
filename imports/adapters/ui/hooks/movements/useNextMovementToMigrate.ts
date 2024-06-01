import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetNextMovementRequestDto } from '@domain/movements/use-cases/get-next-movement/get-next-movement-request.dto';

export const useNextMovementToMigrate = (id?: string) =>
  useQuery<GetNextMovementRequestDto, Error, string | null>(
    [MeteorMethodEnum.MovementsGetNextToMigrate, id],
    () => Meteor.callAsync(MeteorMethodEnum.MovementsGetNextToMigrate, { id }),
    { enabled: !!id },
  );
