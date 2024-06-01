import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { RemoveUserRequestDto } from '@domain/users/use-cases/remove-user/remove-user-request.dto';

export const useRemoveUser = (onSuccess: () => void) =>
  useMutation<null, Error, RemoveUserRequestDto>(
    [MeteorMethodEnum.UsersRemove],
    (request) => Meteor.callAsync(MeteorMethodEnum.UsersRemove, request),
    { onSuccess: () => onSuccess() },
  );
