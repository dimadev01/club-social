import type { DueCategory } from '@club-social/shared/dues';
import type { MemberCategory } from '@club-social/shared/members';
import type { PricingDto } from '@club-social/shared/pricing';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

interface UseActivePricingOptions {
  dueCategory?: DueCategory;
  enabled?: boolean;
  memberCategory?: MemberCategory;
}

export function useActivePricing({
  dueCategory,
  enabled = true,
  memberCategory,
}: UseActivePricingOptions) {
  const permissions = usePermissions();

  return useQuery({
    ...queryKeys.pricing.active(dueCategory, memberCategory),
    enabled:
      enabled && !!dueCategory && !!memberCategory && permissions.pricing.get,
    queryFn: () =>
      $fetch<PricingDto>(`pricing/active`, {
        query: { dueCategory, memberCategory },
      }),
  });
}
