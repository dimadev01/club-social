import {
  AppSettingKey,
  AppSettingScope,
} from '@club-social/shared/app-settings';

import { TEST_CREATED_BY } from '@/shared/test/constants';
import { createTestAppSetting } from '@/shared/test/factories';

import { AppSettingUpdatedEvent } from '../events/app-setting-updated.event';
import { AppSettingEntity } from './app-setting.entity';

describe('AppSettingEntity', () => {
  describe('fromPersistence', () => {
    it('should create an app setting from persisted data', () => {
      const updatedAt = new Date('2024-06-15');

      const setting = AppSettingEntity.fromPersistence(
        {
          description: 'Test description',
          key: AppSettingKey.MAINTENANCE_MODE,
          scope: AppSettingScope.SYSTEM,
          value: { enabled: true },
        },
        {
          updatedAt,
          updatedBy: TEST_CREATED_BY,
        },
      );

      expect(setting.id.value).toBe(AppSettingKey.MAINTENANCE_MODE);
      expect(setting.description).toBe('Test description');
      expect(setting.scope).toBe(AppSettingScope.SYSTEM);
      expect(setting.value).toEqual({ enabled: true });
      expect(setting.updatedAt).toBe(updatedAt);
      expect(setting.updatedBy).toBe(TEST_CREATED_BY);
    });

    it('should create an app setting with null description', () => {
      const setting = createTestAppSetting({ description: null });

      expect(setting.description).toBeNull();
    });

    it('should create an app setting with null updatedBy', () => {
      const setting = createTestAppSetting({ updatedBy: null });

      expect(setting.updatedBy).toBeNull();
    });

    it('should use the key as the entity id', () => {
      const setting = createTestAppSetting();

      expect(setting.id.value).toBe(AppSettingKey.MAINTENANCE_MODE);
    });
  });

  describe('updateValue', () => {
    it('should update the value', () => {
      const setting = createTestAppSetting({ value: { enabled: false } });

      setting.updateValue({ enabled: true }, TEST_CREATED_BY);

      expect(setting.value).toEqual({ enabled: true });
    });

    it('should update the updatedBy field', () => {
      const setting = createTestAppSetting({ updatedBy: null });

      setting.updateValue({ enabled: true }, TEST_CREATED_BY);

      expect(setting.updatedBy).toBe(TEST_CREATED_BY);
    });

    it('should add AppSettingUpdatedEvent when updating', () => {
      const setting = createTestAppSetting();

      setting.updateValue({ enabled: true }, TEST_CREATED_BY);

      const events = setting.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(AppSettingUpdatedEvent);
      expect((events[0] as AppSettingUpdatedEvent).appSetting).toBe(setting);
    });

    it('should add event on each update', () => {
      const setting = createTestAppSetting();

      setting.updateValue({ enabled: true }, TEST_CREATED_BY);
      setting.updateValue({ enabled: false }, TEST_CREATED_BY);

      const events = setting.pullEvents();
      expect(events).toHaveLength(2);
      expect(events[0]).toBeInstanceOf(AppSettingUpdatedEvent);
      expect(events[1]).toBeInstanceOf(AppSettingUpdatedEvent);
    });
  });

  describe('entity equality', () => {
    it('should be equal when ids (keys) match', () => {
      const setting1 = createTestAppSetting({ value: { enabled: false } });
      const setting2 = createTestAppSetting({ value: { enabled: true } });

      expect(setting1.equals(setting2)).toBe(true);
    });
  });

  describe('domain events', () => {
    it('should clear events after pulling', () => {
      const setting = createTestAppSetting();

      setting.updateValue({ enabled: true }, TEST_CREATED_BY);
      const firstPull = setting.pullEvents();
      const secondPull = setting.pullEvents();

      expect(firstPull).toHaveLength(1);
      expect(secondPull).toHaveLength(0);
    });
  });
});
