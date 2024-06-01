import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { useQuery } from '@adapters/ui/hooks/useQuery';
import { GetPendingDueResponseDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-due.dto';
import { GetPendingDuesRequestDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-dues.request.dto';

export const usePendingDuesByMember = (memberId?: string) =>
  useQuery<GetPendingDuesRequestDto, GetPendingDueResponseDto[]>({
    keepPreviousData: !!memberId,
    methodName: MeteorMethodEnum.DuesGetPendingByMember,
    request: memberId ? { memberId } : undefined,
  });
