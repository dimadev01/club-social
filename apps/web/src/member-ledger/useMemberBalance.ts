import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMemberBalance(memberId?: string) {
  return useQuery({
    ...queryKeys.memberLedger.balance(memberId),
    enabled: !!memberId,
    queryFn: () => $fetch<number>(`/member-ledger/${memberId}/balance`),
  });
}
