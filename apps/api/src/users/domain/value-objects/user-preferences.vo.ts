import { Language, Theme, ThemeVariant } from '@club-social/shared/users';

import { ValueObject } from '@/shared/domain/value-objects/value-object.base';

export interface UserPreferencesProps {
  language: Language;
  theme: Theme;
  themeVariant: ThemeVariant;
  timezone: string;
}

export const DEFAULT_USER_PREFERENCES = {
  language: Language.ES,
  theme: Theme.AUTO,
  themeVariant: ThemeVariant.OUTLINED,
  timezone: 'America/Argentina/Buenos_Aires',
} satisfies UserPreferencesProps;

export class UserPreferencesVO extends ValueObject<UserPreferencesProps> {
  public get language(): Language {
    return this.props.language;
  }

  public get theme(): Theme {
    return this.props.theme;
  }

  public get themeVariant(): ThemeVariant {
    return this.props.themeVariant;
  }

  public get timezone(): string {
    return this.props.timezone;
  }

  private constructor(props: UserPreferencesProps) {
    super(props);
  }

  public static raw(props: UserPreferencesProps): UserPreferencesVO {
    return new UserPreferencesVO(props);
  }

  public toJSON(): UserPreferencesProps {
    return { ...this.props };
  }

  public update(partial: Partial<UserPreferencesProps>): UserPreferencesVO {
    return new UserPreferencesVO({ ...this.props, ...partial });
  }

  protected toString(): string {
    return JSON.stringify(this.props);
  }
}
