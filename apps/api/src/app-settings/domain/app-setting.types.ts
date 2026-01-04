import {
  AppSettingKey,
  type AppSettingValues,
  MaintenanceModeValue,
  SendEmailsValue,
} from '@club-social/shared/app-settings';

import { ApplicationError } from '@/shared/domain/errors/application.error';
import { Guard } from '@/shared/domain/guards';
import { err, ok, Result } from '@/shared/domain/result';

type SettingValidator<K extends AppSettingKey> = (
  value: AppSettingValues[K],
) => Result<AppSettingValues[K]>;

const settingValidators: {
  [K in AppSettingKey]: SettingValidator<K>;
} = {
  [AppSettingKey.MAINTENANCE_MODE]: (value: MaintenanceModeValue) => {
    if (!Guard.isObject(value)) {
      return err(
        new ApplicationError('Invalid maintenance mode value: expected object'),
      );
    }

    if (!Guard.isBoolean(value.enabled)) {
      return err(
        new ApplicationError(
          'Invalid maintenance mode value: expected { enabled: boolean }',
        ),
      );
    }

    return ok({ enabled: value.enabled });
  },
  [AppSettingKey.SEND_EMAILS]: (value: SendEmailsValue) => {
    if (!Guard.isObject(value)) {
      return err(
        new ApplicationError('Invalid send emails value: expected object'),
      );
    }

    if (!Guard.isBoolean(value.enabled)) {
      return err(
        new ApplicationError(
          'Invalid send emails value: expected { enabled: boolean }',
        ),
      );
    }

    return ok({ enabled: value.enabled });
  },
};

export function isValidAppSettingKey(key: string): key is AppSettingKey {
  return Object.values(AppSettingKey).includes(key as AppSettingKey);
}

export function validateSettingValue<K extends AppSettingKey>(
  key: K,
  value: unknown,
): Result<AppSettingValues[K]> {
  const validator = settingValidators[key] as SettingValidator<K>;

  return validator(value as AppSettingValues[K]);
}
