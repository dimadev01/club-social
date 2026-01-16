import { AppSettingKey } from '@club-social/shared/app-settings';

import { AppSettingValidators } from './app-setting.validator';

describe('AppSettingValidators', () => {
  describe.each([
    AppSettingKey.MAINTENANCE_MODE,
    AppSettingKey.SEND_EMAILS,
    AppSettingKey.SEND_MEMBER_NOTIFICATIONS,
  ])('%s', (key) => {
    const validator = AppSettingValidators[key];

    it('accepts valid enabled value', () => {
      expect(() => validator({ enabled: false })).not.toThrow();
    });

    it('throws for undefined value', () => {
      expect(() => validator(undefined)).toThrow('Target is null or undefined');
    });

    it('throws for non-object value', () => {
      expect(() => validator('enabled')).toThrow('Target is not an object');
    });

    it('throws for missing enabled property', () => {
      expect(() => validator({})).toThrow(
        'Target does not have property enabled',
      );
    });

    it('throws for non-boolean enabled property', () => {
      expect(() => validator({ enabled: 'true' })).toThrow(
        'Target is not a boolean',
      );
    });
  });
});
