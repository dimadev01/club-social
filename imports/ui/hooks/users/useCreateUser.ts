import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useMutation } from '@tanstack/react-query';
import { AppUrl } from '@ui/app.enum';

export const useCreateUser = () => {
  const navigate = useNavigate();

  return useMutation<string, Error, CreateUserRequestDto>(
    [MethodsEnum.UsersCreate],
    (request) => Meteor.callAsync(MethodsEnum.UsersCreate, request),
    {
      onSuccess: (userId: string) => {
        message.success('Usuario creado');

        navigate(`${AppUrl.Users}/${userId}`);
      },
    }
  );
};
