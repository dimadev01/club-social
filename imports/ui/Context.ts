import { UserThemeEnum } from '@domain/users/user.enum';
import { createContext, useContext } from 'react';

export interface ThemeContextProps {
  setTheme: (theme: UserThemeEnum) => void;
  theme: UserThemeEnum;
}

export const ThemeContext = createContext<ThemeContextProps>({
  setTheme: () => {},
  theme: UserThemeEnum.AUTO,
});

export const useThemeContext = () => useContext(ThemeContext);
