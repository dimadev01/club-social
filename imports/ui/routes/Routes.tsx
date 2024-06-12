import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { EnrollPage } from '@ui/pages/auth/EnrollPage';
import { LoginPage } from '@ui/pages/auth/LoginPage';
import { LoginPasswordlessPage } from '@ui/pages/auth/LoginPasswordlessPage';
import { LogoutPage } from '@ui/pages/auth/LogoutPage';
import { VerifyEmailPage } from '@ui/pages/auth/VerifyEmailPage';
import { DueDetailPage } from '@ui/pages/dues/DueDetailPage';
import { DueEditPage } from '@ui/pages/dues/DueEditPage';
import { DuesNewPage } from '@ui/pages/dues/DuesNewPage';
import { DuesRoot } from '@ui/pages/dues/DuesRoot';
import { HomePage } from '@ui/pages/HomePage';
import { MemberDetailPage } from '@ui/pages/members/MemberDetailPage';
import { MembersPage } from '@ui/pages/members/MembersPage';
import { MovementDetailPage } from '@ui/pages/movements/MovementDetailPage';
import { MovementEditPage } from '@ui/pages/movements/MovementEditPage';
import { MovementNewPage } from '@ui/pages/movements/MovementNewPage';
import { MovementsRoot } from '@ui/pages/movements/MovementsRoot';
import { PaymentDetailPage } from '@ui/pages/payments/PaymentDetailPage';
import { PaymentNewPage } from '@ui/pages/payments/PaymentNewPage';
import { PaymentsRoot } from '@ui/pages/payments/PaymentsRoot';
import { AuthRoute } from '@ui/routes/AuthRoute';
import { PrivateRoute } from '@ui/routes/PrivateRoute';
import { PublicRoute } from '@ui/routes/PublicRoute';

const router = createBrowserRouter([
  {
    element: (
      <AuthRoute>
        <HomePage />
      </AuthRoute>
    ),
    path: AppUrl.Home,
  },
  {
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
    path: AppUrl.LOGIN,
  },
  {
    element: (
      <PublicRoute>
        <LoginPasswordlessPage />
      </PublicRoute>
    ),
    path: AppUrl.LOGIN_PASSWORDLESS,
  },
  {
    element: <LogoutPage />,
    path: AppUrl.LOGOUT,
  },

  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.MEMBERS}>
        <MembersPage />
      </PrivateRoute>
    ),
    path: AppUrl.MEMBERS,
  },
  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.CREATE}
        scope={ScopeEnum.MEMBERS}
      >
        <MemberDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.MEMBERS_NEW,
  },
  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.UPDATE}
        scope={ScopeEnum.MEMBERS}
      >
        <MemberDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.MEMBERS_DETAIL,
  },

  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.READ}
        scope={ScopeEnum.MOVEMENTS}
      >
        <MovementsRoot />
      </PrivateRoute>
    ),
    path: AppUrl.MOVEMENTS,
  },
  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.CREATE}
        scope={ScopeEnum.MOVEMENTS}
      >
        <MovementNewPage />
      </PrivateRoute>
    ),
    path: AppUrl.MOVEMENTS_NEW,
  },
  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.UPDATE}
        scope={ScopeEnum.MOVEMENTS}
      >
        <MovementEditPage />
      </PrivateRoute>
    ),
    path: AppUrl.MOVEMENTS_EDIT,
  },
  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.READ}
        scope={ScopeEnum.MOVEMENTS}
      >
        <MovementDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.MOVEMENTS_DETAIL,
  },

  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.DUES}>
        <DuesRoot />
      </PrivateRoute>
    ),
    path: AppUrl.DUES,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.CREATE} scope={ScopeEnum.DUES}>
        <DuesNewPage />
      </PrivateRoute>
    ),
    path: AppUrl.DUES_NEW,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.UPDATE} scope={ScopeEnum.DUES}>
        <DueEditPage />
      </PrivateRoute>
    ),
    path: AppUrl.DUES_EDIT,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.DUES}>
        <DueDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.DUES_DETAIL,
  },

  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.PAYMENTS}>
        <PaymentsRoot />
      </PrivateRoute>
    ),
    path: AppUrl.PAYMENTS,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.PAYMENTS}>
        <PaymentNewPage />
      </PrivateRoute>
    ),
    path: AppUrl.PAYMENTS_NEW,
  },

  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.PAYMENTS}>
        <PaymentDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.PAYMENTS_DETAIL,
  },

  {
    element: <EnrollPage />,
    path: AppUrl.ENROLL,
  },
  {
    element: <VerifyEmailPage />,
    path: AppUrl.VERIFY_EMAIL,
  },
]);

export const Routes = () => <RouterProvider router={router} />;
