import { Route, Routes } from 'react-router';

import { LoginPage } from '@/auth/LoginPage';
import { LogoutPage } from '@/auth/LogoutPage';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { PublicRoute } from '@/auth/PublicRoute';
import { Home } from '@/home/HomePage';
import { UserDetailPage } from '@/users/UserDetailPage';
import { UserListPage } from '@/users/UserListPage';

import { APP_ROUTES } from './app.enum';

export function AppRoutes() {
  return (
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
        <Route element={<LogoutPage />} path={APP_ROUTES.LOGOUT} />
      </Route>

      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/auth">
          <Route element={<LoginPage />} path={APP_ROUTES.LOGIN} />
        </Route>
      </Route>
    </Routes>
  );
}
