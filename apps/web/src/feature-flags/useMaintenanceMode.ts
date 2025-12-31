import type { FlagResponseDto } from '@/shared/types/flag-response.dto';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMaintenanceMode() {
  return useQuery<FlagResponseDto>({
    ...queryKeys.featureFlags.maintenanceMode,
    queryFn: () => $fetch<FlagResponseDto>('/feature-flags/maintenance-mode'),
  });
}
