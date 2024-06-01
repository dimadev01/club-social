import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';

export const useUser = (id?: string) =>
  useQuery<GetUserRequestDto, Error, Meteor.User | undefined>(
    [MeteorMethodEnum.UsersGet, id],
    () => Meteor.callAsync(MeteorMethodEnum.UsersGet, { id }),
    {
      enabled: !!id,
    },
  );
