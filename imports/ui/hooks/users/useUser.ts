import { useQuery } from '@tanstack/react-query';

import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useUser = (id?: string) =>
  useQuery<GetUserRequestDto, Error, Meteor.User | undefined>(
    [MethodsEnum.UsersGet, id],
    () => Meteor.callAsync(MethodsEnum.UsersGet, { id }),
    {
      enabled: !!id,
    },
  );
