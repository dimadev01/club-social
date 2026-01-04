import type {
  AppSettingDto,
  AppSettingKey,
  AppSettingValues,
} from '@club-social/shared/app-settings';

import { App } from 'antd';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';

interface UpdateAppSettingParams<K extends AppSettingKey> {
  key: K;
  value: AppSettingValues[K];
}

export function useUpdateAppSetting<K extends AppSettingKey>() {
  const { message } = App.useApp();

  return useMutation<AppSettingDto<K>, Error, UpdateAppSettingParams<K>>({
    mutationFn: ({ key, value }) =>
      $fetch<AppSettingDto<K>>(`/app-settings/${key}`, {
        body: { value },
        method: 'PATCH',
      }),
    onSuccess: () => {
      message.success('Configuración actualizada');
    },
  });
}
