import { type UserPreferencesDto } from '@club-social/shared/users';
import { createContext, useContext } from 'react';

import { noop } from '@/shared/lib/utils';

import { AntThemeMode, DEFAULT_PREFERENCES } from './app.enum';

interface AppContextType {
  preferences: UserPreferencesDto;
  resetPreferences: () => void;
  selectedTheme: AntThemeMode;
}

export const AppContext = createContext<AppContextType>({
  preferences: DEFAULT_PREFERENCES,
  resetPreferences: noop,
  selectedTheme: AntThemeMode.LIGHT,
});

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};
