import type {
  AppSettingDto,
  AppSettingKey,
} from '@club-social/shared/app-settings';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useAppSetting<K extends AppSettingKey>(key: K) {
  return useQuery<AppSettingDto<K>>({
    ...queryKeys.appSettings.byKey(key),
    queryFn: () => $fetch<AppSettingDto<K>>(`/app-settings/${key}`),
  });
}
