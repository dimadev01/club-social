import { Theme, ThemeAlgorithm } from '@club-social/shared/users';

export interface UserPreferencesProps {
  theme: Theme;
  themeAlgorithm: ThemeAlgorithm;
}

export const DEFAULT_USER_PREFERENCES = {
  theme: Theme.AUTO,
  themeAlgorithm: ThemeAlgorithm.DEFAULT,
} satisfies UserPreferencesProps;

export class UserPreferences {
  public readonly theme: Theme;
  public readonly themeAlgorithm: ThemeAlgorithm;

  public constructor(props?: Partial<UserPreferencesProps>) {
    this.theme = props?.theme ?? DEFAULT_USER_PREFERENCES.theme;
    this.themeAlgorithm =
      props?.themeAlgorithm ?? DEFAULT_USER_PREFERENCES.themeAlgorithm;
  }

  public toJson(): UserPreferencesProps {
    return {
      theme: this.theme,
      themeAlgorithm: this.themeAlgorithm,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }

  public update(partial: Partial<UserPreferencesProps>): UserPreferences {
    const defined = Object.fromEntries(
      Object.entries(partial).filter(([, v]) => v !== undefined),
    );

    return new UserPreferences({
      ...DEFAULT_USER_PREFERENCES,
      ...this.toJson(),
      ...defined,
    });
  }
}
