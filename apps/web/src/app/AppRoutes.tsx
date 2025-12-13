import { BrowserRouter, Route, Routes } from 'react-router';

import { LoginPage } from '@/auth/LoginPage';
import { LogoutPage } from '@/auth/LogoutPage';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { PublicRoute } from '@/auth/PublicRoute';
import { NotFound } from '@/components/NotFound';
import { Home } from '@/home/HomePage';
import { ProfilePage } from '@/profile/ProfilePage';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { UserDetailPage } from '@/users/UserDetailPage';
import { UserListPage } from '@/users/UserListPage';

import { APP_ROUTES } from './app.enum';
import { AppLoading } from './AppLoading';

export function AppRoutes() {
  const { isPending } = betterAuthClient.useSession();

  if (isPending) {
    return <AppLoading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Home />} path={APP_ROUTES.HOME} />
          <Route element={<UserListPage />} path={APP_ROUTES.USER_LIST} />
          <Route element={<UserDetailPage />} path={APP_ROUTES.USER_NEW} />
          <Route
            element={<UserDetailPage />}
            path={`${APP_ROUTES.USER_LIST}/:id`}
          />
          <Route element={<ProfilePage />} path={APP_ROUTES.PROFILE} />
          <Route element={<LogoutPage />} path={APP_ROUTES.LOGOUT} />
        </Route>

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/auth">
            <Route element={<LoginPage />} path={APP_ROUTES.LOGIN} />
          </Route>
        </Route>

        <Route element={<NotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
