import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

import type { MaintenanceModeDto } from './types';

export function useMaintenanceMode() {
  return useQuery<MaintenanceModeDto>({
    ...queryKeys.appSettings.maintenanceMode,
    queryFn: () => $fetch<MaintenanceModeDto>('/app-settings/maintenance-mode'),
  });
}
