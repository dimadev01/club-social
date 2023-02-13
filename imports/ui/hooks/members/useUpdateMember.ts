import { message } from 'antd';
import { UpdateMemberRequestDto } from '@domain/members/use-cases/update-member/update-member-request.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useUpdateMember = () =>
  useMutation<undefined, Error, UpdateMemberRequestDto>(
    [MethodsEnum.MembersUpdate],
    (request) => Meteor.callAsync(MethodsEnum.MembersUpdate, request),
    {
      onSuccess: () => {
        message.success('Socio actualizado');
      },
    }
  );
