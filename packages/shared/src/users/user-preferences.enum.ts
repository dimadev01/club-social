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
  DEFAULT: 'default',
  FILLED: 'filled',
  OUTLINED: 'outlined',
  UNDERLINED: 'underlined',
} as const;

export type ThemeVariant = (typeof ThemeVariant)[keyof typeof ThemeVariant];

export const ThemeVariantLabel: Record<ThemeVariant, string> = {
  [ThemeVariant.BORDERLESS]: 'Sin bordes',
  [ThemeVariant.DEFAULT]: 'Predeterminado',
  [ThemeVariant.FILLED]: 'Relleno',
  [ThemeVariant.OUTLINED]: 'Con bordes',
  [ThemeVariant.UNDERLINED]: 'Subrayado',
} as const;

export const ThemeAlgorithm = {
  COMPACT: 'compact',
  DEFAULT: 'default',
} as const;

export type ThemeAlgorithm =
  (typeof ThemeAlgorithm)[keyof typeof ThemeAlgorithm];
