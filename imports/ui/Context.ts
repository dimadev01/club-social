import { createContext, useContext } from 'react';

import { AppThemeEnum } from './app.enum';

export interface ThemeContextProps {
  setTheme: (theme: AppThemeEnum) => void;
  theme: AppThemeEnum;
}

export const ThemeContext = createContext<ThemeContextProps>({
  setTheme: () => {},
  theme: AppThemeEnum.LIGHT,
});

export const useThemeContext = () => useContext(ThemeContext);
