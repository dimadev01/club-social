import { useQuery } from '@tanstack/react-query';

import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useUser = (id?: string) =>
  useQuery<GetUserRequestDto, Error, Meteor.User | undefined>(
    [MeteorMethodEnum.UsersGet, id],
    () => Meteor.callAsync(MeteorMethodEnum.UsersGet, { id }),
    {
      enabled: !!id,
    },
  );
