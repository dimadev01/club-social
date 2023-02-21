import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useMembers = () =>
  useQuery<undefined, Error, GetMembersDto[]>(
    [MethodsEnum.MembersGetList],
    () => Meteor.callAsync(MethodsEnum.MembersGetList)
  );
