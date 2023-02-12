import { message } from 'antd';
import { UpdateUserRequestDto } from '@domain/users/use-cases/update-user/update-user-request.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUser = () =>
  useMutation<undefined, Error, UpdateUserRequestDto>(
    [MethodsEnum.UsersUpdate],
    (request) => Meteor.callAsync(MethodsEnum.UsersUpdate, request),
    {
      onSuccess: () => {
        message.success('Usuario actualizado');
      },
    }
  );
