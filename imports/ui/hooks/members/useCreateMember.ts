import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@tanstack/react-query';

export const useCreateMember = () =>
  useMutation<string, Error, CreateMemberRequestDto>(
    [MethodsEnum.MembersCreate],
    (request) => Meteor.callAsync(MethodsEnum.MembersCreate, request),
  );
