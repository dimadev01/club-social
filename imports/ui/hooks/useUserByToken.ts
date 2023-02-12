import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useUserByToken = (token?: string) =>
  useQuery<GetUserRequestDto, Error, Meteor.User | undefined>(
    [MethodsEnum.UsersGetOneByToken, token],
    () => Meteor.callAsync(MethodsEnum.UsersGetOneByToken, { token }),
    {
      enabled: !!token,
    }
  );
