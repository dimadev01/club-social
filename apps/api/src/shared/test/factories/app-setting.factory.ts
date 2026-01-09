import {
  AppSettingKey,
  AppSettingScope,
} from '@club-social/shared/app-settings';

import {
  AppSettingEntity,
  type AppSettingPersistenceMeta,
  type AppSettingProps,
} from '@/app-settings/domain/entities/app-setting.entity';

export type AppSettingPropsOverrides<
  K extends AppSettingKey = typeof AppSettingKey.MAINTENANCE_MODE,
> = Partial<AppSettingPersistenceMeta & AppSettingProps<K>>;

const createAppSettingProps = <
  K extends AppSettingKey = typeof AppSettingKey.MAINTENANCE_MODE,
>(
  overrides?: AppSettingPropsOverrides<K>,
) => ({
  description:
    'description' in (overrides ?? {})
      ? (overrides?.description as null | string)
      : 'Maintenance mode setting',
  key: (overrides?.key ?? AppSettingKey.MAINTENANCE_MODE) as K,
  scope: overrides?.scope ?? AppSettingScope.SYSTEM,
  value: (overrides?.value ?? {
    enabled: false,
  }) as AppSettingProps<K>['value'],
});

const createAppSettingMeta = <K extends AppSettingKey>(
  overrides?: AppSettingPropsOverrides<K>,
) => ({
  updatedAt: overrides?.updatedAt ?? new Date('2024-01-01'),
  updatedBy:
    'updatedBy' in (overrides ?? {})
      ? (overrides?.updatedBy as null | string)
      : null,
});

export const createTestAppSetting = <
  K extends AppSettingKey = typeof AppSettingKey.MAINTENANCE_MODE,
>(
  overrides?: AppSettingPropsOverrides<K>,
): AppSettingEntity<K> =>
  AppSettingEntity.fromPersistence(
    createAppSettingProps(overrides),
    createAppSettingMeta(overrides),
  );
