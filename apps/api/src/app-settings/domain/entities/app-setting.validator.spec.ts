import { AppSettingKey } from '@club-social/shared/app-settings';

import { AppSettingValidators } from './app-setting.validator';

describe('AppSettingValidators', () => {
  describe(AppSettingKey.GROUP_DISCOUNT_TIERS, () => {
    const validator = AppSettingValidators[AppSettingKey.GROUP_DISCOUNT_TIERS];

    it('accepts valid tiers', () => {
      expect(() =>
        validator([
          { maxSize: 5, minSize: 1, percent: 10 },
          { maxSize: 10, minSize: 6, percent: 15 },
        ]),
      ).not.toThrow();
    });

    it('throws for undefined value', () => {
      expect(() => validator(undefined)).toThrow('Target is null or undefined');
    });

    it('throws for non-array value', () => {
      expect(() => validator({})).toThrow('Target is not an array');
    });

    it('throws when a tier is not an object', () => {
      expect(() => validator([null])).toThrow('Target is not an object');
    });

    it('throws when a tier is missing a property', () => {
      expect(() => validator([{ maxSize: 5, minSize: 1 }])).toThrow(
        'Target does not have property percent',
      );
    });

    it('throws when a tier property is not a number', () => {
      expect(() =>
        validator([{ maxSize: 5, minSize: '1', percent: 10 }]),
      ).toThrow('Target is not a number');
    });
  });

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
