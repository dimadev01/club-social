import { Theme, ThemeAlgorithm, ThemeVariant } from './user-preferences.enum';

export type UpdateUserPreferencesDto = Partial<{
  theme: Theme;
  themeAlgorithm: ThemeAlgorithm;
  themeVariant: ThemeVariant;
}>;

export interface UserPreferencesDto {
  theme: Theme;
  themeAlgorithm: ThemeAlgorithm;
  themeVariant: ThemeVariant;
}
