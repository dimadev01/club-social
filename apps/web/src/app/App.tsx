import { Center, Loader } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router';

import { LoginPage } from '@/auth/LoginPage';
import { LogoutPage } from '@/auth/LogoutPage';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { PublicRoute } from '@/auth/PublicRoute';
import { useSupabaseSession } from '@/auth/useSupabaseSession';
import { Home } from '@/home/HomePage';

import { AppContext } from './app.context';

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
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<Home />} path="/" />
            <Route element={<LogoutPage />} path="auth/logout" />
          </Route>

          <Route element={<PublicRoute />} path="/auth">
            <Route element={<LoginPage />} path="login" />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
