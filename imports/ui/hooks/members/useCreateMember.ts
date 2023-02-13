import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useMutation } from '@tanstack/react-query';
import { AppUrl } from '@ui/app.enum';

export const useCreateMember = () => {
  const navigate = useNavigate();

  return useMutation<string, Error, CreateMemberRequestDto>(
    [MethodsEnum.MembersCreate],
    (request) => Meteor.callAsync(MethodsEnum.MembersCreate, request),
    {
      onSuccess: (memberId: string) => {
        message.success('Socio creado');

        navigate(`${AppUrl.Members}/${memberId}`);
      },
    }
  );
};
