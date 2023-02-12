import { GetUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useUser = (id?: string) =>
  useQuery<GetUserRequestDto, Error, Meteor.User | undefined>(
    [MethodsEnum.UsersGetOne, id],
    () => Meteor.callAsync(MethodsEnum.UsersGetOne, { id }),
    {
      enabled: !!id,
    }
  );
