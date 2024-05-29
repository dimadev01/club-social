import { useMutation } from '@tanstack/react-query';

import { RemoveUserRequestDto } from '@domain/users/use-cases/remove-user/remove-user-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useRemoveUser = (onSuccess: () => void) =>
  useMutation<null, Error, RemoveUserRequestDto>(
    [MeteorMethodEnum.UsersRemove],
    (request) => Meteor.callAsync(MeteorMethodEnum.UsersRemove, request),
    { onSuccess: () => onSuccess() },
  );
