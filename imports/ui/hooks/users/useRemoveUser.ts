import { RemoveUserRequestDto } from '@domain/users/use-cases/remove-user/remove-user-request.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useRemoveUser = (onSuccess: () => void) =>
  useMutation<undefined, Error, RemoveUserRequestDto>(
    [MethodsEnum.UsersRemove],
    (request) => Meteor.callAsync(MethodsEnum.UsersRemove, request),
    { onSuccess }
  );
