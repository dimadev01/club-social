import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useUpdateUser = () =>
  useMutation<null, Error, UpdateUserRequestDto>(
    [MeteorMethodEnum.UsersUpdate],
    (request) => Meteor.callAsync(MeteorMethodEnum.UsersUpdate, request),
  );
