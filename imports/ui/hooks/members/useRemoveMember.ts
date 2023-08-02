import { RemoveMemberRequestDto } from '@domain/members/use-cases/remove-member/remove-member-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useRemoveMember = (onSuccess: () => void) =>
  useMutation<undefined, Error, RemoveMemberRequestDto>(
    [MethodsEnum.MembersRemove],
    (request) => Meteor.callAsync(MethodsEnum.MembersRemove, request),
    { onSuccess }
  );
