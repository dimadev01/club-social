import { useQuery } from '@tanstack/react-query';

import { GetUserByTokenRequestDto } from '@application/users/dtos/get-user-by-token-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';

export const useUserByToken = (token?: string) =>
  useQuery<GetUserByTokenRequestDto, Error, Meteor.User | undefined>(
    [MeteorMethodEnum.UsersGetByToken, token],
    () => Meteor.callAsync(MeteorMethodEnum.UsersGetByToken, { token }),
    {
      enabled: !!token,
    },
  );
