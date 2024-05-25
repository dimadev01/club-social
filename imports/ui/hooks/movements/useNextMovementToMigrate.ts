import { GetNextMovementRequestDto } from '@domain/movements/use-cases/get-next-movement/get-next-movement-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useNextMovementToMigrate = (id?: string) =>
  useQuery<GetNextMovementRequestDto, Error, string | null>(
    [MethodsEnum.MovementsGetNextToMigrate, id],
    () => Meteor.callAsync(MethodsEnum.MovementsGetNextToMigrate, { id }),
    { enabled: !!id },
  );
