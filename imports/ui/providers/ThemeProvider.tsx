import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { UserThemeEnum } from '@domain/users/user.enum';
import { LocalStorageUtils } from '@shared/utils/localStorage.utils';
import { AppThemeEnum } from '@ui/app.enum';
import { ThemeContext, ThemeContextProps } from '@ui/providers/ThemeContext';
import { useUserContext } from '@ui/providers/UserContext';

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUserContext();

  const systemPrefersDark = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });

  const [theme, setTheme] = useState<AppThemeEnum>(
    LocalStorageUtils.get<AppThemeEnum>('theme') ??
      (systemPrefersDark ? AppThemeEnum.DARK : AppThemeEnum.LIGHT),
  );

  const stateMemoized = useMemo<ThemeContextProps>(
    () => ({ setTheme, theme }),
    [theme],
  );

  useEffect(() => {
    if (user?.profile?.theme === UserThemeEnum.AUTO) {
      setTheme(systemPrefersDark ? AppThemeEnum.DARK : AppThemeEnum.LIGHT);
    } else if (user?.profile?.theme === UserThemeEnum.DARK) {
      setTheme(AppThemeEnum.DARK);
    } else if (user?.profile?.theme === UserThemeEnum.LIGHT) {
      setTheme(AppThemeEnum.LIGHT);
    }
  }, [user?.profile?.theme, systemPrefersDark]);

  return (
    <ThemeContext.Provider value={stateMemoized}>
      {children}
    </ThemeContext.Provider>
  );
};
