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

export const ThemeVariant = {
  BORDERLESS: 'borderless',
  FILLED: 'filled',
  OUTLINED: 'outlined',
} as const;

export type ThemeVariant = (typeof ThemeVariant)[keyof typeof ThemeVariant];

export const ThemeVariantLabel: Record<ThemeVariant, string> = {
  [ThemeVariant.BORDERLESS]: 'Sin bordes',
  [ThemeVariant.FILLED]: 'Relleno',
  [ThemeVariant.OUTLINED]: 'Con bordes',
} as const;

export const Language = {
  EN: 'en',
  ES: 'es',
} as const;

export type Language = (typeof Language)[keyof typeof Language];

export const LanguageLabel: Record<Language, string> = {
  [Language.EN]: 'English',
  [Language.ES]: 'Español',
} as const;

export interface UserPreferences {
  language: Language;
  theme: Theme;
  themeVariant: ThemeVariant;
  timezone: string;
}
