import { AppSettingKey } from '@club-social/shared/app-settings';

import { Guard } from '@/shared/domain/guards';

type AppSettingValidatorFn = (value: unknown) => void;

export const AppSettingValidators: Record<
  AppSettingKey,
  AppSettingValidatorFn
> = {
  [AppSettingKey.MAINTENANCE_MODE]: (value: unknown) => {
    Guard.defined(value);
    Guard.object(value);
    Guard.hasProperty(value, 'enabled');
    Guard.boolean(value.enabled);
  },
  [AppSettingKey.SEND_EMAILS]: (value: unknown) => {
    Guard.defined(value);
    Guard.object(value);
    Guard.hasProperty(value, 'enabled');
    Guard.boolean(value.enabled);
  },
  [AppSettingKey.SEND_MEMBER_NOTIFICATIONS]: (value: unknown) => {
    Guard.defined(value);
    Guard.object(value);
    Guard.hasProperty(value, 'enabled');
    Guard.boolean(value.enabled);
  },
};
