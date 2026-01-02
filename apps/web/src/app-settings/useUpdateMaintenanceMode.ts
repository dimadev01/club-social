import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';

import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

import type { AppSettingDto, UpdateMaintenanceModeDto } from './types';

export function useUpdateMaintenanceMode() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (data: UpdateMaintenanceModeDto) =>
      $fetch<AppSettingDto>('/app-settings/maintenance-mode', {
        body: JSON.stringify(data),
        method: 'PATCH',
      }),
    onError: () => {
      message.error('Error al actualizar el modo de mantenimiento');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appSettings._def });
      message.success('Modo de mantenimiento actualizado');
    },
  });
}
