import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useUserByToken = (token?: string) =>
  useQuery<GetUserRequestDto, Error, Meteor.User | undefined>(
    [MethodsEnum.UsersGetByToken, token],
    () => Meteor.callAsync(MethodsEnum.UsersGetByToken, { token }),
    {
      enabled: !!token,
    }
  );
