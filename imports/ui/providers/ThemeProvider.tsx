import React, { PropsWithChildren, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { LocalStorageUtils } from '@shared/utils/localStorage.utils';
import { AppThemeEnum } from '@ui/app.enum';
import { ThemeContext, ThemeContextProps } from '@ui/providers/ThemeContext';

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
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

  return (
    <ThemeContext.Provider value={stateMemoized}>
      {children}
    </ThemeContext.Provider>
  );
};
