import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/devtools';
import { App as AntApp, ConfigProvider, theme as antTheme } from 'antd';
import esEs from 'antd/es/locale/es_ES';
import clsx from 'clsx';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useMemo, useState } from 'react';
import GoogleFontLoader from 'react-google-font';
import { useMediaQuery } from 'react-responsive';

import { AppThemeEnum } from './app.enum';
import { ThemeContext, ThemeContextProps } from './Context';
import { UiNotificationUtils } from './utils/messages.utils';

import { UserThemeEnum } from '@domain/users/user.enum';
import { LocalStorageUtils } from '@shared/utils/localStorage.utils';
import { Routes } from '@ui/Routes/Routes';

export const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (error: unknown) => {
              // eslint-disable-next-line no-console
              console.log('onErrorMutation', error);

              if (error instanceof Meteor.Error && error.reason) {
                UiNotificationUtils.errorWithNoContext(error.reason);
              } else if (error instanceof Error) {
                UiNotificationUtils.errorWithNoContext(error.message);
              } else {
                UiNotificationUtils.errorWithNoContext(
                  'An unknown error occurred.',
                );
              }
            },
          },
          queries: {
            onError: (error: unknown) => {
              // eslint-disable-next-line no-console
              console.log('onErrorQuery', error);

              if (error instanceof Meteor.Error && error.reason) {
                UiNotificationUtils.errorWithNoContext(error.reason);
              } else if (error instanceof Error) {
                UiNotificationUtils.errorWithNoContext(error.message);
              } else {
                UiNotificationUtils.errorWithNoContext(
                  'An unknown error occurred.',
                );
              }
            },
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  const systemPrefersDark = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });

  const [theme, setTheme] = useState<AppThemeEnum>(
    LocalStorageUtils.get<AppThemeEnum>('theme') ??
      (systemPrefersDark ? AppThemeEnum.DARK : AppThemeEnum.LIGHT),
  );

  const themeMemoized = useMemo<ThemeContextProps>(
    () => ({ setTheme, theme }),
    [theme],
  );

  const { isLoggingIn, user } = useTracker(() => ({
    isLoggingIn: Meteor.loggingIn(),
    user: Meteor.user(),
  }));

  useEffect(() => {
    if (user?.profile?.theme === UserThemeEnum.AUTO) {
      setTheme(systemPrefersDark ? AppThemeEnum.DARK : AppThemeEnum.LIGHT);
    } else if (user?.profile?.theme === UserThemeEnum.DARK) {
      setTheme(AppThemeEnum.DARK);
    } else if (user?.profile?.theme === UserThemeEnum.LIGHT) {
      setTheme(AppThemeEnum.LIGHT);
    }
  }, [user?.profile?.theme, systemPrefersDark]);

  if (isLoggingIn) {
    return <>loggingIn</>;
  }

  return (
    <>
      <GoogleFontLoader fonts={[{ font: 'Rubik', weights: [300, 400, 500] }]} />
      <ConfigProvider
        locale={esEs}
        select={{ showSearch: true }}
        popupMatchSelectWidth={false}
        form={{ requiredMark: 'optional' }}
        input={{ autoComplete: 'on' }}
        theme={{
          algorithm:
            themeMemoized.theme === AppThemeEnum.LIGHT
              ? antTheme.defaultAlgorithm
              : antTheme.darkAlgorithm,
          components: {
            Button: {
              primaryShadow: '0 2px 0 rgba(5, 145, 255, 0.1)',
            },
            Layout: {
              lightSiderBg: '#f8f9fd',
              siderBg: '#111111',
            },
            Menu: {
              itemBg: 'transparent',
              itemSelectedBg: 'transparent',
            },
            Table: {
              bodySortBg: 'transparent',
            },
          },
          token: {
            colorPrimary: '#22883e',
            fontFamily: 'Rubik',
          },
        }}
      >
        <AntApp
          rootClassName={clsx('cs-ant-app', {
            dark: themeMemoized.theme === AppThemeEnum.DARK,
          })}
        >
          <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={themeMemoized}>
              <Routes />
            </ThemeContext.Provider>

            {!Meteor.isProduction && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </AntApp>
      </ConfigProvider>
    </>
  );
};
