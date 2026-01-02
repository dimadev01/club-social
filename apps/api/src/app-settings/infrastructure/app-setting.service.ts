import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import type { AppSettingRepository } from '../domain/app-setting.repository';

import { APP_SETTING_REPOSITORY_PROVIDER } from '../domain/app-setting.repository';
import {
  AppSettingKey,
  AppSettingValues,
  MaintenanceModeValue,
} from '../domain/app-setting.types';

const CACHE_KEY_PREFIX = 'app-setting:';
const CACHE_TTL_MILLISECONDS = 7 * 24 * 60 * 60 * 1_000; // 7 days

@Injectable()
export class AppSettingService {
  public constructor(
    @Inject(APP_SETTING_REPOSITORY_PROVIDER)
    private readonly repository: AppSettingRepository,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  public async getMaintenanceMode(): Promise<MaintenanceModeValue> {
    return this.getValue(AppSettingKey.MAINTENANCE_MODE);
  }

  public async invalidate(key: AppSettingKey): Promise<void> {
    await this.cacheManager.del(this.getCacheKey(key));
  }

  private getCacheKey(key: AppSettingKey): string {
    return `${CACHE_KEY_PREFIX}${key}`;
  }

  private async getValue<K extends AppSettingKey>(
    key: K,
  ): Promise<AppSettingValues[K]> {
    const cacheKey = this.getCacheKey(key);

    // Try to get from cache first
    const cached = await this.cacheManager.get<AppSettingValues[K]>(cacheKey);

    if (cached) {
      return cached;
    }

    // Cache miss - fetch from database
    const entity = await this.repository.findByKeyOrThrow(key);

    // Store in cache with TTL
    await this.cacheManager.set(cacheKey, entity.value, CACHE_TTL_MILLISECONDS);

    return entity.value;
  }
}
