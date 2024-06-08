import { useQuery } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetUserByTokenRequestDto } from '@application/users/dtos/get-user-by-token-request.dto';

export const useUserByToken = (token?: string) =>
  useQuery<GetUserByTokenRequestDto, Error, Meteor.User | undefined>(
    [MeteorMethodEnum.UsersGetByToken, token],
    () => Meteor.callAsync(MeteorMethodEnum.UsersGetByToken, { token }),
    {
      enabled: !!token,
    },
  );
