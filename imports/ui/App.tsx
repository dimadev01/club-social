import React, { useMemo, useState } from 'react';
import { App as AntApp, ConfigProvider, message, theme } from 'antd';
import esEs from 'antd/es/locale/es_ES';
import { useTracker } from 'meteor/react-meteor-data';
import GoogleFontLoader from 'react-google-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/devtools';
import { Routes } from '@ui/Routes/Routes';
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
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('light');

  const themeContextValue = useMemo<ThemeContextProps>(
    () => ({ setTheme: setThemeMode, theme: themeMode }),
    [themeMode]
  );

  const { isLoggingIn } = useTracker(() => ({
    isLoggingIn: Meteor.loggingIn(),
    user: Meteor.user(),
  }));

  if (isLoggingIn) {
    return <>loggingIn</>;
  }

  return (
    <>
      <GoogleFontLoader fonts={[{ font: 'Rubik', weights: [300, 400, 500] }]} />

      <AntApp rootClassName="cs-ant-app">
        <ConfigProvider
          locale={esEs}
          select={{ showSearch: true }}
          popupMatchSelectWidth={false}
          form={{ requiredMark: 'optional' }}
          input={{ autoComplete: 'on' }}
          theme={{
            algorithm: theme.defaultAlgorithm,
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
            },
            token: {
              colorPrimary: '#22883e',
              fontFamily: 'Rubik',
            },
          }}
        >
          <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={themeContextValue}>
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
