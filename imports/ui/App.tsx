import { useMediaQuery } from 'react-responsive';
import React, { useEffect, useMemo, useState } from 'react';
import {
  App as AntApp,
  ConfigProvider,
  message,
  theme as antTheme,
} from 'antd';
import esEs from 'antd/es/locale/es_ES';
import { useTracker } from 'meteor/react-meteor-data';
import GoogleFontLoader from 'react-google-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/devtools';
import { Routes } from '@ui/Routes/Routes';
import clsx from 'clsx';
import { UserThemeEnum } from '@domain/users/user.enum';
import { LocalStorageUtils } from '@shared/utils/localStorage.utils';
import { ThemeContext, ThemeContextProps } from './Context';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: unknown) => {
        if (error instanceof Meteor.Error) {
          message.error(error.reason);
        } else if (error instanceof Error) {
          message.error(error.message);
        } else {
          message.error('An unknown error occurred.');
        }
      },
    },
    queries: {
      onError: (error: unknown) => {
        if (error instanceof Meteor.Error) {
          message.error(error.reason);
        } else if (error instanceof Error) {
          message.error(error.message);
        } else {
          message.error('An unknown error occurred.');
        }
      },
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App = () => {
  const systemPrefersDark = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });

  const [theme, setTheme] = useState<UserThemeEnum>(
    LocalStorageUtils.get('theme') ?? systemPrefersDark
      ? UserThemeEnum.DARK
      : UserThemeEnum.LIGHT,
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
      setTheme(systemPrefersDark ? UserThemeEnum.DARK : UserThemeEnum.LIGHT);
    } else {
      setTheme(user?.profile?.theme ?? UserThemeEnum.LIGHT);
    }
  }, [user?.profile?.theme, systemPrefersDark]);

  if (isLoggingIn) {
    return <>loggingIn</>;
  }

  return (
    <>
      <GoogleFontLoader fonts={[{ font: 'Rubik', weights: [300, 400, 500] }]} />

      <AntApp rootClassName={clsx('cs-ant-app')}>
        <ConfigProvider
          locale={esEs}
          select={{ showSearch: true }}
          popupMatchSelectWidth={false}
          form={{ requiredMark: 'optional' }}
          input={{ autoComplete: 'on' }}
          theme={{
            algorithm:
              themeMemoized.theme === UserThemeEnum.LIGHT
                ? antTheme.defaultAlgorithm
                : antTheme.darkAlgorithm,
            components: {
              Button: {
                primaryShadow: '0 2px 0 rgba(5, 145, 255, 0.1)',
              },
              Layout: {
                lightSiderBg: '#f8f9fd',
                siderBg: '#000',
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
          <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={themeMemoized}>
              <Routes />
            </ThemeContext.Provider>

            {!Meteor.isProduction && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </ConfigProvider>
      </AntApp>
    </>
  );
};
