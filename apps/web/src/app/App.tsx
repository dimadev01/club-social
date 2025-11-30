import { Center, Loader } from '@mantine/core';
import { BrowserRouter } from 'react-router';

import { useSupabaseSession } from '@/auth/useSupabaseSession';

import { AppContext } from './app.context';
import { AppRoutes } from './AppRoutes';

export function App() {
  const { isLoading, session } = useSupabaseSession();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <AppContext.Provider value={{ session }}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppContext.Provider>
  );
}
