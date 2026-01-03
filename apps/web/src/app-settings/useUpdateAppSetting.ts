import type {
  AppSettingDto,
  AppSettingKey,
  AppSettingValues,
} from '@club-social/shared/app-settings';

import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

interface UpdateAppSettingParams<K extends AppSettingKey> {
  key: K;
  value: AppSettingValues[K];
}

export function useUpdateAppSetting<K extends AppSettingKey>() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation<AppSettingDto<K>, Error, UpdateAppSettingParams<K>>({
    mutationFn: ({ key, value }) =>
      $fetch<AppSettingDto<K>>(`/app-settings/${key}`, {
        body: { value },
        method: 'PATCH',
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appSettings.byKey(variables.key).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.appSettings.all.queryKey,
      });
      // Also invalidate specific endpoints like maintenanceMode
      queryClient.invalidateQueries({
        queryKey: queryKeys.appSettings.maintenanceMode.queryKey,
      });
      message.success('Configuración actualizada');
    },
  });
}
