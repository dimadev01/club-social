import type { IPaymentDueDetailDto } from '@club-social/shared/payment-due';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

export function getPaymentDuesByDueQueryOptions(dueId: string) {
  return {
    ...queryKeys.dues.payments(dueId),
    queryFn: () => $fetch<IPaymentDueDetailDto[]>(`dues/${dueId}/payments`),
  };
}

export function usePaymentDuesByDue(dueId?: string) {
  const permissions = usePermissions();

  return useQuery({
    ...getPaymentDuesByDueQueryOptions(dueId ?? ''),
    enabled: !!dueId && permissions.payments.get,
  });
}
