import { Theme, ThemeAlgorithm, ThemeVariant } from '@club-social/shared/users';

import { UserPreferences } from './user-preferences.vo';

describe('UserPreferences', () => {
  describe('raw', () => {
    it('should create preferences with defaults when no props are provided', () => {
      const preferences = UserPreferences.raw();

      expect(preferences.theme).toBe(Theme.AUTO);
      expect(preferences.themeAlgorithm).toBe(ThemeAlgorithm.DEFAULT);
      expect(preferences.themeVariant).toBe(ThemeVariant.DEFAULT);
    });

    it('should create preferences with defaults when props are null', () => {
      const preferences = UserPreferences.raw(null);

      expect(preferences.theme).toBe(Theme.AUTO);
      expect(preferences.themeAlgorithm).toBe(ThemeAlgorithm.DEFAULT);
      expect(preferences.themeVariant).toBe(ThemeVariant.DEFAULT);
    });

    it('should create preferences using overrides', () => {
      const preferences = UserPreferences.raw({
        theme: Theme.DARK,
        themeAlgorithm: ThemeAlgorithm.COMPACT,
        themeVariant: ThemeVariant.FILLED,
      });

      expect(preferences.theme).toBe(Theme.DARK);
      expect(preferences.themeAlgorithm).toBe(ThemeAlgorithm.COMPACT);
      expect(preferences.themeVariant).toBe(ThemeVariant.FILLED);
    });
  });

  describe('toJson', () => {
    it('should return a plain object representation', () => {
      const preferences = UserPreferences.raw({
        theme: Theme.LIGHT,
        themeAlgorithm: ThemeAlgorithm.COMPACT,
        themeVariant: ThemeVariant.OUTLINED,
      });

      expect(preferences.toJson()).toEqual({
        theme: Theme.LIGHT,
        themeAlgorithm: ThemeAlgorithm.COMPACT,
        themeVariant: ThemeVariant.OUTLINED,
      });
    });
  });

  describe('update', () => {
    it('should update defined values and keep existing ones', () => {
      const preferences = UserPreferences.raw({
        theme: Theme.LIGHT,
        themeAlgorithm: ThemeAlgorithm.DEFAULT,
        themeVariant: ThemeVariant.DEFAULT,
      });

      const updated = preferences.update({
        themeAlgorithm: ThemeAlgorithm.COMPACT,
        themeVariant: ThemeVariant.BORDERLESS,
      });

      expect(updated.theme).toBe(Theme.LIGHT);
      expect(updated.themeAlgorithm).toBe(ThemeAlgorithm.COMPACT);
      expect(updated.themeVariant).toBe(ThemeVariant.BORDERLESS);
    });

    it('should ignore undefined values in updates', () => {
      const preferences = UserPreferences.raw({
        theme: Theme.DARK,
        themeAlgorithm: ThemeAlgorithm.COMPACT,
        themeVariant: ThemeVariant.UNDERLINED,
      });

      const updated = preferences.update({
        theme: undefined,
        themeVariant: ThemeVariant.OUTLINED,
      });

      expect(updated.theme).toBe(Theme.DARK);
      expect(updated.themeAlgorithm).toBe(ThemeAlgorithm.COMPACT);
      expect(updated.themeVariant).toBe(ThemeVariant.OUTLINED);
    });
  });

  describe('toString', () => {
    it('should return a string representation of the preferences', () => {
      const preferences = UserPreferences.raw({
        theme: Theme.LIGHT,
        themeAlgorithm: ThemeAlgorithm.COMPACT,
        themeVariant: ThemeVariant.OUTLINED,
      });

      expect(preferences.toString()).toBe(JSON.stringify(preferences.toJson()));
    });
  });
});
