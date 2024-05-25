import { DeleteMemberRequestDto } from '@domain/members/use-cases/delete-member/delete-member-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useDeleteMember = (onSuccess: () => void) =>
  useMutation<null, Error, DeleteMemberRequestDto>(
    [MethodsEnum.MembersDelete],
    (request) => Meteor.callAsync(MethodsEnum.MembersDelete, request),
    { onSuccess: () => onSuccess() },
  );
