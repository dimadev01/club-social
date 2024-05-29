import { useQuery } from '@tanstack/react-query';

import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useMembers = (enabled = true) =>
  useQuery<null, Error, GetMembersDto[]>(
    [MeteorMethodEnum.MembersGet],
    () => Meteor.callAsync(MeteorMethodEnum.MembersGet),
    { enabled },
  );
