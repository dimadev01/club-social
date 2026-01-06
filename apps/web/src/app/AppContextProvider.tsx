import { Theme, ThemeAlgorithm, ThemeVariant } from '@club-social/shared/users';
import { type PropsWithChildren, useMemo } from 'react';
import { useMedia } from 'react-use';

import { useMyPreferences } from '@/users/useMyPreferences';
import { useUpdateMyPreferences } from '@/users/useUpdateMyPreferences';

import { AntThemeMode, AppContext } from './AppContext';
import { AppLoading } from './AppLoading';

export function AppContextProvider({ children }: PropsWithChildren) {
  const { data: preferences, isLoading } = useMyPreferences();
  const { mutate: updatePreferences } = useUpdateMyPreferences();

  const prefersDark = useMedia('(prefers-color-scheme: dark)');

  const resolvedPreferences = useMemo(
    () =>
      preferences ?? {
        theme: Theme.AUTO,
        themeAlgorithm: ThemeAlgorithm.DEFAULT,
        themeVariant: ThemeVariant.DEFAULT,
      },
    [preferences],
  );

  const resolvedAntTheme = useMemo(() => {
    const isDark =
      preferences?.theme === Theme.DARK ||
      (preferences?.theme === Theme.AUTO && prefersDark);

    return isDark ? AntThemeMode.DARK : AntThemeMode.LIGHT;
  }, [preferences, prefersDark]);

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <AppContext.Provider
      value={{
        isLoading,
        preferences: resolvedPreferences,
        selectedTheme: resolvedAntTheme,
        updatePreferences,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
