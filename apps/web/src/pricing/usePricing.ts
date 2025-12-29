import type { PricingDto } from '@club-social/shared/pricing';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

export function usePricing(id?: string) {
  const permissions = usePermissions();

  return useQuery({
    ...queryKeys.pricing.detail(id),
    enabled: !!id && permissions.pricing.get,
    queryFn: () => $fetch<PricingDto>(`pricing/${id}`),
  });
}
