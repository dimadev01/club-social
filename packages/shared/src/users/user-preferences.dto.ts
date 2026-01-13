import { Theme, ThemeAlgorithm } from './user-preferences.enum';

export type UpdateUserPreferencesDto = Partial<{
  theme: Theme;
  themeAlgorithm: ThemeAlgorithm;
}>;

export interface UserPreferencesDto {
  theme: Theme;
  themeAlgorithm: ThemeAlgorithm;
}
