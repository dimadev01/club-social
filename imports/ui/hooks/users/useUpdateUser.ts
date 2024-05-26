import { useMutation } from '@tanstack/react-query';

import { UpdateUserRequestDto } from '@domain/users/use-cases/update-user/update-user-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useUpdateUser = () =>
  useMutation<null, Error, UpdateUserRequestDto>(
    [MethodsEnum.UsersUpdate],
    (request) => Meteor.callAsync(MethodsEnum.UsersUpdate, request),
  );
