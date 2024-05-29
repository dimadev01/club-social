import { useQuery } from '@tanstack/react-query';

import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useUserByToken = (token?: string) =>
  useQuery<GetUserRequestDto, Error, Meteor.User | undefined>(
    [MeteorMethodEnum.UsersGetByToken, token],
    () => Meteor.callAsync(MeteorMethodEnum.UsersGetByToken, { token }),
    {
      enabled: !!token,
    },
  );
