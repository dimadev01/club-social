import { GetMemberRequestDto } from '@domain/members/use-cases/get-member/get-member-request.dto';
import { GetMemberResponseDto } from '@domain/members/use-cases/get-member/get-member-response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useMember = (id?: string) =>
  useQuery<GetMemberRequestDto, Error, GetMemberResponseDto | undefined>(
    [MethodsEnum.MembersGet, id],
    () => Meteor.callAsync(MethodsEnum.MembersGet, { id }),
    { enabled: !!id }
  );
