import type { IPaymentDueDetailWithDueDto } from '@club-social/shared/payment-due';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

export function getPaymentDuesByPaymentQueryOptions(paymentId: string) {
  return {
    ...queryKeys.payments.dues(paymentId),
    queryFn: () =>
      $fetch<IPaymentDueDetailWithDueDto[]>(`payments/${paymentId}/dues`),
  };
}

export function usePaymentDuesByPayment(paymentId?: string) {
  const permissions = usePermissions();

  return useQuery({
    ...getPaymentDuesByPaymentQueryOptions(paymentId ?? ''),
    enabled: !!paymentId && permissions.payments.get,
  });
}
