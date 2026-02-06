import type {
  AppSettingDto,
  AppSettingKey,
  AppSettingValues,
} from '@club-social/shared/app-settings';

import { usePostHog } from '@posthog/react';
import { App } from 'antd';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { PostHogEvent } from '@/shared/lib/posthog-events';

interface UpdateAppSettingParams<K extends AppSettingKey> {
  key: K;
  value: AppSettingValues[K];
}

export function useUpdateAppSetting<K extends AppSettingKey>() {
  const { message } = App.useApp();
  const posthog = usePostHog();

  return useMutation<AppSettingDto<K>, Error, UpdateAppSettingParams<K>>({
    mutationFn: ({ key, value }) =>
      $fetch<AppSettingDto<K>>(`/app-settings/${key}`, {
        body: { value },
        method: 'PATCH',
      }),
    onSuccess: (_data, variables) => {
      message.success('Configuración actualizada');
      posthog.capture(PostHogEvent.APP_SETTING_UPDATED, {
        setting_key: variables.key,
      });
    },
  });
}
