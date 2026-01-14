import type { MembershipPricingDto } from '@club-social/shared/pricing';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

interface UseMembershipPricingForMemberOptions {
  enabled?: boolean;
  memberId?: string;
}

export function useMembershipPricingForMember({
  enabled = true,
  memberId,
}: UseMembershipPricingForMemberOptions) {
  const permissions = usePermissions();

  return useQuery({
    ...queryKeys.pricing.membershipForMember(memberId),
    enabled: enabled && !!memberId && permissions.pricing.get,
    queryFn: () =>
      $fetch<MembershipPricingDto>('pricing/membership/for-member', {
        query: { memberId },
      }),
  });
}
