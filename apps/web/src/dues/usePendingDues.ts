import type { PendingDueDto } from '@club-social/shared/dues';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

export function usePendingDues(memberId?: string, enabled = true) {
  const permissions = usePermissions();

  return useQuery({
    ...queryKeys.dues.pending(memberId),
    enabled: enabled && !!memberId && permissions.dues.get,
    queryFn: () =>
      $fetch<PendingDueDto[]>(`dues/pending`, { query: { memberId } }),
  });
}
