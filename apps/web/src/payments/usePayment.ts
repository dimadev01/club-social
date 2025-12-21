import type { IPaymentDetailDto } from '@club-social/shared/payments';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

export function usePayment(id?: string) {
  const permissions = usePermissions();

  return useQuery({
    ...queryKeys.payments.detail(id),
    enabled: !!id && permissions.payments.get,
    queryFn: () => $fetch<IPaymentDetailDto>(`payments/${id}`),
  });
}
