import { Theme } from '@club-social/shared/users';
import { useQueryClient } from '@tanstack/react-query';
import { type PropsWithChildren, useCallback, useMemo } from 'react';
import { useMedia } from 'react-use';

import { queryKeys } from '@/shared/lib/query-keys';
import { useMyPreferences } from '@/users/useMyPreferences';

import { AntThemeMode, DEFAULT_PREFERENCES } from './app.enum';
import { AppContext } from './AppContext';
import { AppLoading } from './AppLoading';

export function AppContextProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useMyPreferences();

  const prefersDark = useMedia('(prefers-color-scheme: dark)');

  const resetPreferences = useCallback(() => {
    queryClient.setQueryData(queryKeys.users.me.queryKey, DEFAULT_PREFERENCES);
  }, [queryClient]);

  const resolvedPreferences = useMemo(
    () => preferences ?? DEFAULT_PREFERENCES,
    [preferences],
  );

  const selectedTheme = useMemo(() => {
    const isDark =
      resolvedPreferences.theme === Theme.DARK ||
      (resolvedPreferences.theme === Theme.AUTO && prefersDark);

    return isDark ? AntThemeMode.DARK : AntThemeMode.LIGHT;
  }, [resolvedPreferences, prefersDark]);

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <AppContext.Provider
      value={{
        preferences: resolvedPreferences,
        resetPreferences,
        selectedTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
