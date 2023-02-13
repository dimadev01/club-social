import { Member } from '@domain/members/member.entity';
import { GetMemberRequestDto } from '@domain/members/use-cases/get-member/get-member-request.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useQuery } from '@tanstack/react-query';

export const useMember = (id?: string) =>
  useQuery<GetMemberRequestDto, Error, Member | undefined>(
    [MethodsEnum.MembersGet, id],
    () => Meteor.callAsync(MethodsEnum.MembersGet, { id }),
    {
      enabled: !!id,
    }
  );
