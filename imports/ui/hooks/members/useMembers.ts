import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useMembers = (enabled = true) =>
  useQuery<undefined, Error, GetMembersDto[]>(
    [MethodsEnum.MembersGetAll],
    () => Meteor.callAsync(MethodsEnum.MembersGetAll),
    { enabled }
  );
