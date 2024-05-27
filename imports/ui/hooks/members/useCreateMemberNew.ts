import { useMutation } from '@tanstack/react-query';

import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useCreateMemberNew = () =>
  useMutation<string, Error, CreateMemberRequestDto>(
    [MethodsEnum.MembersCreateNew],
    (request) => Meteor.callAsync(MethodsEnum.MembersCreateNew, request),
  );
