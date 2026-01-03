import type {
  AppSettingDto,
  AppSettingKey,
} from '@club-social/shared/app-settings';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMaintenanceMode() {
  return useQuery<AppSettingDto<typeof AppSettingKey.MAINTENANCE_MODE>>({
    ...queryKeys.appSettings.maintenanceMode,
    queryFn: () =>
      $fetch<AppSettingDto<typeof AppSettingKey.MAINTENANCE_MODE>>(
        '/app-settings/maintenance-mode',
      ),
  });
}
