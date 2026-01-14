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

const DEFAULT_VALUES: {
  [K in AppSettingKey]: AppSettingProps<K>['value'];
} = {
  [AppSettingKey.GROUP_DISCOUNT_TIERS]: [],
  [AppSettingKey.MAINTENANCE_MODE]: { enabled: false },
  [AppSettingKey.SEND_EMAILS]: { enabled: false },
  [AppSettingKey.SEND_MEMBER_NOTIFICATIONS]: { enabled: false },
};

const DEFAULT_DESCRIPTIONS: Record<AppSettingKey, string> = {
  [AppSettingKey.GROUP_DISCOUNT_TIERS]: 'Group discount tiers setting',
  [AppSettingKey.MAINTENANCE_MODE]: 'Maintenance mode setting',
  [AppSettingKey.SEND_EMAILS]: 'Send emails setting',
  [AppSettingKey.SEND_MEMBER_NOTIFICATIONS]:
    'Send member notifications setting',
};

const getDefaultScope = (key: AppSettingKey) =>
  key === AppSettingKey.MAINTENANCE_MODE || key === AppSettingKey.SEND_EMAILS
    ? AppSettingScope.SYSTEM
    : AppSettingScope.APP;

const createAppSettingProps = <
  K extends AppSettingKey = typeof AppSettingKey.MAINTENANCE_MODE,
>(
  overrides?: AppSettingPropsOverrides<K>,
) => {
  const key = (overrides?.key ?? AppSettingKey.MAINTENANCE_MODE) as K;

  return {
    description:
      'description' in (overrides ?? {})
        ? ((overrides?.description ?? null) as null | string)
        : DEFAULT_DESCRIPTIONS[key],
    key,
    scope: overrides?.scope ?? getDefaultScope(key),
    value: (overrides?.value ??
      DEFAULT_VALUES[key]) as AppSettingProps<K>['value'],
  };
};

const createAppSettingMeta = <K extends AppSettingKey>(
  overrides?: AppSettingPropsOverrides<K>,
) => ({
  updatedAt: overrides?.updatedAt ?? new Date('2024-01-01'),
  updatedBy:
    'updatedBy' in (overrides ?? {})
      ? ((overrides?.updatedBy ?? null) as null | string)
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
