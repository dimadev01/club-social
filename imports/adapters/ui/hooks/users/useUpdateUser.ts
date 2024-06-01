import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';

export const useUpdateUser = () =>
  useMutation<null, Error, UpdateUserRequestDto>(
    [MeteorMethodEnum.UsersUpdate],
    (request) => Meteor.callAsync(MeteorMethodEnum.UsersUpdate, request),
  );
