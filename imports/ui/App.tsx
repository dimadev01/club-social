import React from 'react';
import { App as AntApp, ConfigProvider, message } from 'antd';
import esEs from 'antd/es/locale/es_ES';
import { useTracker } from 'meteor/react-meteor-data';
import GoogleFontLoader from 'react-google-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/devtools';
import { Routes } from '@ui/Routes/Routes';

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

      <AntApp>
        <ConfigProvider
          locale={esEs}
          select={{
            showSearch: true,
          }}
          dropdownMatchSelectWidth={false}
          form={{
            requiredMark: 'optional',
            scrollToFirstError: true,
          }}
          input={{
            autoComplete: 'on',
          }}
          theme={{
            token: {
              colorTextBase: '#505050',
              fontFamily: 'Rubik',
            },
          }}
        >
          <QueryClientProvider client={queryClient}>
            <Routes />

            {!Meteor.isProduction && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </ConfigProvider>
      </AntApp>
    </>
  );
};
