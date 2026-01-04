import { AppSettingKey } from '@club-social/shared/app-settings';

import { AppSettingEntity } from './entities/app-setting.entity';

export const APP_SETTING_REPOSITORY_PROVIDER = Symbol('AppSettingRepository');

export interface AppSettingRepository {
  findAll(): Promise<AppSettingEntity[]>;
  findByKeyOrThrow<K extends AppSettingKey>(
    key: K,
  ): Promise<AppSettingEntity<K>>;
  save(entity: AppSettingEntity): Promise<void>;
}
