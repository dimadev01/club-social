import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { useQuery } from '@ui/hooks/useQuery';

export const usePendingDuesByMember = (memberId?: string) =>
  useQuery<GetPendingDuesRequestDto, GetPendingDueResponseDto[]>({
    keepPreviousData: !!memberId,
    methodName: MeteorMethodEnum.DuesGetPendingByMember,
    request: memberId ? { memberId } : undefined,
  });
