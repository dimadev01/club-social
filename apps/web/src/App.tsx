import { Center, Loader } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router';

import { AppContext } from './context/app.context';
import { Home } from './HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { LogoutPage } from './pages/auth/LogoutPage';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { useSupabaseSession } from './useSupabaseSession';

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
