import { useMutation } from '@tanstack/react-query';

import { UpdateMemberRequestDto } from '@domain/members/use-cases/update-member/update-member-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useUpdateMember = () =>
  useMutation<null, Error, UpdateMemberRequestDto>(
    [MethodsEnum.MembersUpdate],
    (request) => Meteor.callAsync(MethodsEnum.MembersUpdate, request),
  );
