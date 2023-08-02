import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useCreateUser = () =>
  useMutation<string, Error, CreateUserRequestDto>(
    [MethodsEnum.UsersCreate],
    (request) => Meteor.callAsync(MethodsEnum.UsersCreate, request)
  );
