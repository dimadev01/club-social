import {
  Theme,
  ThemeAlgorithm,
  ThemeVariant,
  type UserPreferencesDto,
} from '@club-social/shared/users';
import { createContext, useContext } from 'react';

import { noop } from '@/shared/lib/utils';

export const AntThemeMode = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;

export type AntThemeMode = (typeof AntThemeMode)[keyof typeof AntThemeMode];

export const DEFAULT_PREFERENCES: UserPreferencesDto = {
  theme: Theme.LIGHT,
  themeAlgorithm: ThemeAlgorithm.DEFAULT,
  themeVariant: ThemeVariant.DEFAULT,
};

interface AppContextType {
  preferences: UserPreferencesDto;
  resetPreferences: () => void;
  selectedTheme: AntThemeMode;
  updatePreferences: (preferences: Partial<UserPreferencesDto>) => void;
}

export const AppContext = createContext<AppContextType>({
  preferences: DEFAULT_PREFERENCES,
  resetPreferences: noop,
  selectedTheme: AntThemeMode.LIGHT,
  updatePreferences: noop,
});

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};
