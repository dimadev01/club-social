import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';
import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useCreateUser = () =>
  useMutation<string, Error, CreateUserRequestDto>(
    [MeteorMethodEnum.UsersCreate],
    (request) => Meteor.callAsync(MeteorMethodEnum.UsersCreate, request),
  );
