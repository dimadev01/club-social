import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

import type { AppSettingDto } from './types';

export function useAppSettings() {
  return useQuery<AppSettingDto[]>({
    ...queryKeys.appSettings.all,
    queryFn: () => $fetch<AppSettingDto[]>('/app-settings'),
  });
}
