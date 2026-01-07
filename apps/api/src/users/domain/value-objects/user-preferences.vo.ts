import { Theme, ThemeAlgorithm, ThemeVariant } from '@club-social/shared/users';

import { ValueObject } from '@/shared/domain/value-objects/value-object.base';

export interface UserPreferencesProps {
  theme: Theme;
  themeAlgorithm: ThemeAlgorithm;
  themeVariant: ThemeVariant;
}

export const DEFAULT_USER_PREFERENCES = {
  theme: Theme.AUTO,
  themeAlgorithm: ThemeAlgorithm.DEFAULT,
  themeVariant: ThemeVariant.DEFAULT,
} satisfies UserPreferencesProps;

export class UserPreferences extends ValueObject<UserPreferencesProps> {
  public get theme(): Theme {
    return this.props.theme;
  }

  public get themeAlgorithm(): ThemeAlgorithm {
    return this.props.themeAlgorithm;
  }

  public get themeVariant(): ThemeVariant {
    return this.props.themeVariant;
  }

  private constructor(props: UserPreferencesProps) {
    super(props);
  }

  public static raw(
    props?: null | Partial<UserPreferencesProps>,
  ): UserPreferences {
    return new UserPreferences({
      ...DEFAULT_USER_PREFERENCES,
      ...props,
    });
  }

  public toJson(): UserPreferencesProps {
    return {
      theme: this.props.theme,
      themeAlgorithm: this.props.themeAlgorithm,
      themeVariant: this.props.themeVariant,
    };
  }

  public toString(): string {
    return JSON.stringify(this.props);
  }

  public update(partial: Partial<UserPreferencesProps>): UserPreferences {
    const defined = Object.fromEntries(
      Object.entries(partial).filter(([, v]) => v !== undefined),
    );

    return new UserPreferences({
      ...DEFAULT_USER_PREFERENCES,
      ...this.props,
      ...defined,
    });
  }
}
