import type { IMemberLedgerEntryDetailDto } from '@club-social/shared/members';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMemberLedgerEntry(id?: string) {
  return useQuery({
    ...queryKeys.memberLedger.detail(id),
    enabled: !!id,
    queryFn: () => $fetch<IMemberLedgerEntryDetailDto>(`/member-ledger/${id}`),
  });
}
