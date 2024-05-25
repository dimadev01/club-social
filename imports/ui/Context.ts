import { createContext, useContext } from 'react';

export interface ThemeContextProps {
  setTheme: (theme: 'dark' | 'light') => void;
  theme: 'dark' | 'light';
}

export const ThemeContext = createContext<ThemeContextProps>({
  setTheme: () => {},
  theme: 'light',
});

export const useThemeContext = () => useContext(ThemeContext);
