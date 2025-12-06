import type { Session } from '@supabase/supabase-js';

import { type ThemeConfig } from 'antd';
import { createContext, useContext } from 'react';

import { noop } from '@/shared/lib/utils';

export type AppAlgorithm = NonNullable<ThemeConfig['algorithm']>;

export const APP_THEME_MODE = {
  AUTO: 'auto',
  DARK: 'dark',
  LIGHT: 'light',
} as const;

export type AppThemeMode = (typeof APP_THEME_MODE)[keyof typeof APP_THEME_MODE];

interface AppContextType {
  session: null | Session;
  setThemeMode: (theme: AppThemeMode) => void;
  themeMode: AppThemeMode;
}

export const AppContext = createContext<AppContextType>({
  session: null,
  setThemeMode: noop,
  themeMode: APP_THEME_MODE.AUTO,
});

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};
