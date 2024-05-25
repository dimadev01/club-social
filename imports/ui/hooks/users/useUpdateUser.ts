import { UpdateUserRequestDto } from '@domain/users/use-cases/update-user/update-user-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUser = () =>
  useMutation<null, Error, UpdateUserRequestDto>(
    [MethodsEnum.UsersUpdate],
    (request) => Meteor.callAsync(MethodsEnum.UsersUpdate, request),
  );
