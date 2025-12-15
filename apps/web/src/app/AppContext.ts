import { type ThemeConfig } from 'antd';
import { createContext, useContext } from 'react';

import { noop } from '@/shared/lib/utils';

export type AppAlgorithm = NonNullable<ThemeConfig['algorithm']>;

export const AppThemeMode = {
  AUTO: 'auto',
  DARK: 'dark',
  LIGHT: 'light',
} as const;

export type AppTheme = (typeof AppTheme)[keyof typeof AppTheme];
export type AppThemeMode = (typeof AppThemeMode)[keyof typeof AppThemeMode];

export const AppTheme = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;

interface AppContextType {
  appThemeMode: AppThemeMode;
  setAppThemeMode: (theme: AppThemeMode) => void;
  setThemeMode: (theme: 'dark' | 'light') => void;
  themeMode: 'dark' | 'light';
}

export const AppContext = createContext<AppContextType>({
  appThemeMode: AppThemeMode.AUTO,
  setAppThemeMode: noop,
  setThemeMode: noop,
  themeMode: 'light',
});

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};
