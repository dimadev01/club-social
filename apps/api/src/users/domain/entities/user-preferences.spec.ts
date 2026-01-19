import { Theme, ThemeAlgorithm } from '@club-social/shared/users';

import { UserPreferences } from './user-preferences';

describe('UserPreferences', () => {
  describe('raw', () => {
    it('should create preferences with defaults when no props are provided', () => {
      const preferences = UserPreferences.raw();

      expect(preferences.theme).toBe(Theme.AUTO);
      expect(preferences.themeAlgorithm).toBe(ThemeAlgorithm.DEFAULT);
    });

    it('should create preferences with defaults when props are null', () => {
      const preferences = UserPreferences.raw(null);

      expect(preferences.theme).toBe(Theme.AUTO);
      expect(preferences.themeAlgorithm).toBe(ThemeAlgorithm.DEFAULT);
    });

    it('should create preferences using overrides', () => {
      const preferences = UserPreferences.raw({
        theme: Theme.DARK,
        themeAlgorithm: ThemeAlgorithm.COMPACT,
      });

      expect(preferences.theme).toBe(Theme.DARK);
      expect(preferences.themeAlgorithm).toBe(ThemeAlgorithm.COMPACT);
    });
  });

  describe('toJson', () => {
    it('should return a plain object representation', () => {
      const preferences = UserPreferences.raw({
        theme: Theme.LIGHT,
        themeAlgorithm: ThemeAlgorithm.COMPACT,
      });

      expect(preferences.toJson()).toEqual({
        theme: Theme.LIGHT,
        themeAlgorithm: ThemeAlgorithm.COMPACT,
      });
    });
  });

  describe('update', () => {
    it('should update defined values and keep existing ones', () => {
      const preferences = UserPreferences.raw({
        theme: Theme.LIGHT,
        themeAlgorithm: ThemeAlgorithm.DEFAULT,
      });

      const updated = preferences.update({
        themeAlgorithm: ThemeAlgorithm.COMPACT,
      });

      expect(updated.theme).toBe(Theme.LIGHT);
      expect(updated.themeAlgorithm).toBe(ThemeAlgorithm.COMPACT);
    });

    it('should ignore undefined values in updates', () => {
      const preferences = UserPreferences.raw({
        theme: Theme.DARK,
        themeAlgorithm: ThemeAlgorithm.COMPACT,
      });

      const updated = preferences.update({
        theme: undefined,
      });

      expect(updated.theme).toBe(Theme.DARK);
      expect(updated.themeAlgorithm).toBe(ThemeAlgorithm.COMPACT);
    });
  });

  describe('toString', () => {
    it('should return a string representation of the preferences', () => {
      const preferences = UserPreferences.raw({
        theme: Theme.LIGHT,
        themeAlgorithm: ThemeAlgorithm.COMPACT,
      });

      expect(preferences.toString()).toBe(JSON.stringify(preferences.toJson()));
    });
  });
});
