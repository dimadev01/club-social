import { UserPreferencesDto } from './user-preferences.dto';

export const Theme = {
  AUTO: 'auto',
  DARK: 'dark',
  LIGHT: 'light',
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

export const ThemeLabel: Record<Theme, string> = {
  [Theme.AUTO]: 'Automático',
  [Theme.DARK]: 'Oscuro',
  [Theme.LIGHT]: 'Claro',
} as const;

export const ThemeAlgorithm = {
  COMPACT: 'compact',
  DEFAULT: 'default',
} as const;

export type ThemeAlgorithm =
  (typeof ThemeAlgorithm)[keyof typeof ThemeAlgorithm];

export const ThemeAlgorithmLabel: Record<ThemeAlgorithm, string> = {
  [ThemeAlgorithm.COMPACT]: 'Compacto',
  [ThemeAlgorithm.DEFAULT]: 'Predeterminado',
} as const;

export const DEFAULT_PREFERENCES: UserPreferencesDto = {
  theme: Theme.AUTO,
  themeAlgorithm: ThemeAlgorithm.DEFAULT,
};
