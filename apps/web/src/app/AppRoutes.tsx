import { BrowserRouter, Route, Routes } from 'react-router';

import { LoginPage } from '@/auth/LoginPage';
import { LogoutPage } from '@/auth/LogoutPage';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { PublicRoute } from '@/auth/PublicRoute';
import { DueEdit } from '@/dues/DueEdit';
import { DueList } from '@/dues/DueList';
import { DueNew } from '@/dues/DueNew';
import { DueView } from '@/dues/DueView';
import { Home } from '@/home/HomePage';
import { MemberDetailPage } from '@/members/MemberDetailPage';
import { MemberListPage } from '@/members/MemberListPage';
import { PaymentList } from '@/payments/PaymentList';
import { PaymentNew } from '@/payments/PaymentNew';
import { PaymentView } from '@/payments/PaymentView';
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

          <Route path={APP_ROUTES.DUES}>
            <Route element={<DueList />} index />
            <Route element={<DueNew />} path={APP_ROUTES.NEW} />
            <Route element={<DueView />} path={APP_ROUTES.VIEW} />
            <Route element={<DueEdit />} path={APP_ROUTES.EDIT} />
          </Route>

          <Route path={APP_ROUTES.PAYMENTS}>
            <Route element={<PaymentList />} index />
            <Route element={<PaymentNew />} path={APP_ROUTES.NEW} />
            <Route element={<PaymentView />} path={APP_ROUTES.VIEW} />
          </Route>

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
