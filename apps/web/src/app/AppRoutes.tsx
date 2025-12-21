import { BrowserRouter, Route, Routes } from 'react-router';

import { LoginPage } from '@/auth/LoginPage';
import { LogoutPage } from '@/auth/LogoutPage';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { PublicRoute } from '@/auth/PublicRoute';
import { DueDetailPage } from '@/dues/DueDetailPage';
import { DueListPage } from '@/dues/DueListPage';
import { Home } from '@/home/HomePage';
import { MemberDetailPage } from '@/members/MemberDetailPage';
import { MemberListPage } from '@/members/MemberListPage';
import { PaymentDetailPage } from '@/payments/PaymentDetailPage';
import { PaymentListPage } from '@/payments/PaymentListPage';
import { ProfilePage } from '@/profile/ProfilePage';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { NotFound } from '@/ui/NotFound';
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

          <Route element={<UserListPage />} path={APP_ROUTES.USERS_LIST} />
          <Route element={<UserDetailPage />} path={APP_ROUTES.USERS_NEW} />
          <Route
            element={<UserDetailPage />}
            path={`${APP_ROUTES.USERS_LIST}/:id`}
          />

          <Route element={<MemberListPage />} path={APP_ROUTES.MEMBERS_LIST} />
          <Route element={<MemberDetailPage />} path={APP_ROUTES.MEMBERS_NEW} />
          <Route
            element={<MemberDetailPage />}
            path={APP_ROUTES.MEMBERS_DETAIL}
          />

          <Route element={<DueListPage />} path={APP_ROUTES.DUES_LIST} />
          <Route element={<DueDetailPage />} path={APP_ROUTES.DUES_NEW} />
          <Route element={<DueDetailPage />} path={APP_ROUTES.DUES_DETAIL} />

          <Route
            element={<PaymentListPage />}
            path={APP_ROUTES.PAYMENTS_LIST}
          />
          <Route
            element={<PaymentDetailPage />}
            path={APP_ROUTES.PAYMENTS_NEW}
          />
          <Route
            element={<PaymentDetailPage />}
            path={APP_ROUTES.PAYMENTS_DETAIL}
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
