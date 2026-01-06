import {
  Theme,
  ThemeAlgorithm,
  ThemeVariant,
  type UserPreferencesDto,
} from '@club-social/shared/users';
import { type ThemeConfig } from 'antd';
import { createContext, useContext } from 'react';

import { noop } from '@/shared/lib/utils';

export type AppAlgorithm = NonNullable<ThemeConfig['algorithm']>;

export const AppThemeMode = {
  AUTO: 'auto',
  DARK: 'dark',
  LIGHT: 'light',
} as const;

export type AntThemeMode = (typeof AntThemeMode)[keyof typeof AntThemeMode];
export type AppThemeMode = (typeof AppThemeMode)[keyof typeof AppThemeMode];

export const AntThemeMode = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;

interface AppContextType {
  // appThemeMode: AppThemeMode;
  isLoading: boolean;
  preferences: UserPreferencesDto;
  selectedTheme: AntThemeMode;

  ///
  // setAppThemeMode: (theme: AppThemeMode) => void;
  // setThemeMode: (theme: 'dark' | 'light') => void;
  // themeMode: 'dark' | 'light';
  updatePreferences: (preferences: Partial<UserPreferencesDto>) => void;
}

export const AppContext = createContext<AppContextType>({
  isLoading: false,
  preferences: {
    theme: Theme.AUTO,
    themeAlgorithm: ThemeAlgorithm.DEFAULT,
    themeVariant: ThemeVariant.DEFAULT,
  },
  // appThemeMode: AppThemeMode.AUTO,
  selectedTheme: AntThemeMode.LIGHT,
  // setAppThemeMode: noop,
  // setThemeMode: noop,
  // themeMode: 'light',
  updatePreferences: noop,
});

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};
