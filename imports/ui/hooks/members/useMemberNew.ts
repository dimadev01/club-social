import { useQuery } from '@tanstack/react-query';

import { GetMemberRequestDto } from '@domain/members/use-cases/get-member/get-member-request.dto';
import { GetMemberResponseDto } from '@domain/members/use-cases/get-member/get-member-response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useMemberNew = (id?: string) =>
  useQuery<GetMemberRequestDto, Error, GetMemberResponseDto | undefined>(
    [MethodsEnum.MembersGetNew, id],
    () => Meteor.callAsync(MethodsEnum.MembersGetNew, { id }),
    { enabled: !!id },
  );
