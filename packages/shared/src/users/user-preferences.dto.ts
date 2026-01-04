import { Language, Theme, ThemeVariant } from './user-preferences.enum';

export type UpdateUserPreferencesDto = Partial<UserPreferencesDto>;

export interface UserPreferencesDto {
  language: Language;
  theme: Theme;
  themeVariant: ThemeVariant;
  timezone: string;
}
