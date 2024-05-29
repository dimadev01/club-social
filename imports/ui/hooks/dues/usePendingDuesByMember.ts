import { useQuery } from '@tanstack/react-query';

import { GetPendingDueResponseDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-due.dto';
import { GetPendingDuesRequestDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-dues.request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const usePendingDuesByMember = (memberId?: string) =>
  useQuery<GetPendingDuesRequestDto, Error, GetPendingDueResponseDto[]>(
    [MeteorMethodEnum.DuesGetPendingByMember, memberId],
    () =>
      Meteor.callAsync(MeteorMethodEnum.DuesGetPendingByMember, { memberId }),
    { enabled: !!memberId, keepPreviousData: true },
  );
