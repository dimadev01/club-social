import {
  Center,
  Container,
  createTheme,
  Loader,
  MantineProvider,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router';

import { useSupabaseSession } from '@/auth/useSupabaseSession';

import { AppContext } from './app.context';
import { AppRoutes } from './AppRoutes';

const theme = createTheme({
  colors: {
    green: [
      '#effbf2',
      '#ddf4e4',
      '#b6e9c4',
      '#8ddea2',
      '#6bd585',
      '#56cf73',
      '#4acc69',
      '#3bb458',
      '#32a04d',
      '#22883e',
    ],
  },
  components: {
    Container: Container.extend({
      defaultProps: {
        size: 'xl',
      },
    }),
  },
  primaryColor: 'green',
  primaryShade: 9,
});

const queryClient = new QueryClient();

export function App() {
  const { isLoading, session } = useSupabaseSession();

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center>
          <Loader />
        </Center>
      );
    }

    return (
      <AppContext.Provider value={{ session }}>
        <Notifications position="top-center" />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <ReactQueryDevtools
            buttonPosition="top-right"
            initialIsOpen={false}
          />
        </QueryClientProvider>
      </AppContext.Provider>
    );
  };

  return (
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      {renderContent()}
    </MantineProvider>
  );
}
