import type { AppSettingDto } from '@club-social/shared/app-settings';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useAppSettings() {
  return useQuery<AppSettingDto[]>({
    ...queryKeys.appSettings.all,
    queryFn: () => $fetch<AppSettingDto[]>('/app-settings'),
  });
}
