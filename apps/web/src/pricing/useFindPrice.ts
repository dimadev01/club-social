import type { DueCategory } from '@club-social/shared/dues';
import type { MemberCategory } from '@club-social/shared/members';
import type { FoundPricingDto } from '@club-social/shared/pricing';

import { useMemo } from 'react';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

interface Props {
  dueCategory: DueCategory;
  enabled?: boolean;
  memberCategory?: MemberCategory;
  memberId?: string;
}

export function useFindPrice({
  dueCategory,
  enabled = true,
  memberCategory,
  memberId,
}: Props) {
  const permissions = usePermissions();

  const query = useMemo(() => {
    if (!memberCategory || !memberId) {
      return undefined;
    }

    return {
      dueCategory,
      memberCategory,
      memberId,
    };
  }, [dueCategory, memberCategory, memberId]);

  return useQuery({
    ...queryKeys.pricing.find(query),
    enabled: enabled && !!query && permissions.pricing.get,
    queryFn: () => $fetch<FoundPricingDto | null>('pricing/find', { query }),
  });
}
