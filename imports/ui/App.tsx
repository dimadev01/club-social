import React from 'react';
import { ConfigProvider, message } from 'antd';
import esEs from 'antd/es/locale/es_ES';
import { useTracker } from 'meteor/react-meteor-data';
import GoogleFontLoader from 'react-google-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/devtools';
import { Routes } from '@ui/routes/Routes';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: unknown) => {
        if (error instanceof Error) {
          message.error(error.message);
        } else {
          message.error('An unknown error occurred.');
        }
      },
    },
    queries: {
      onError: (error: unknown) => {
        if (error instanceof Error) {
          message.error(error.message);
        } else {
          message.error('An unknown error occurred.');
        }
      },
      retry: 1,
    },
  },
});

export const App = () => {
  const { user } = useTracker(() => ({
    user: Meteor.user(),
  }));

  console.log(user);

  if (Meteor.loggingIn()) {
    return <>loggingIn</>;
  }

  return (
    <>
      <GoogleFontLoader fonts={[{ font: 'Rubik', weights: [300, 400, 500] }]} />

      <ConfigProvider
        locale={esEs}
        theme={{
          token: {
            borderRadius: 5,
            colorPrimary: '#06afd6',
            colorTextBase: '#505050',
            fontFamily: 'Rubik',
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Routes />

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ConfigProvider>
    </>
  );
};
