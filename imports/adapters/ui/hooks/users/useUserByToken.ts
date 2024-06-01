import { GetUserRequestDto } from '@application/users/use-cases/get-user/get-user-request.dto';
import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';

export const useUserByToken = (token?: string) =>
  useQuery<GetUserRequestDto, Error, Meteor.User | undefined>(
    [MeteorMethodEnum.UsersGetByToken, token],
    () => Meteor.callAsync(MeteorMethodEnum.UsersGetByToken, { token }),
    {
      enabled: !!token,
    },
  );
