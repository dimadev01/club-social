import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppUrl } from '@adapters/ui/app.enum';
import { EnrollPage } from '@adapters/ui/pages/auth/EnrollPage';
import { LoginPage } from '@adapters/ui/pages/auth/LoginPage';
import { LoginPasswordlessPage } from '@adapters/ui/pages/auth/LoginPasswordlessPage';
import { LogoutPage } from '@adapters/ui/pages/auth/LogoutPage';
import { VerifyEmailPage } from '@adapters/ui/pages/auth/VerifyEmailPage';
import { DueDetailPage } from '@adapters/ui/pages/dues/DueDetailPage';
import { DuesRoot } from '@adapters/ui/pages/dues/DuesRoot';
import { HomePage } from '@adapters/ui/pages/HomePage';
import { MembersDetailPage } from '@adapters/ui/pages/members/MemberDetailPage/MemberDetailPage';
import { MembersPage } from '@adapters/ui/pages/members/MembersPage';
import { MovementDetailPage } from '@adapters/ui/pages/movements/MovementDetailPage';
import { MovementsRoot } from '@adapters/ui/pages/movements/MovementsRoot';
import { PaymentDetailPage } from '@adapters/ui/pages/payments/PaymentDetailPage';
import { PaymentNewPage } from '@adapters/ui/pages/payments/PaymentNewPage';
import { PaymentsRoot } from '@adapters/ui/pages/payments/PaymentsRoot';
import { AuthRoute } from '@adapters/ui/routes/AuthRoute';
import { PrivateRoute } from '@adapters/ui/routes/PrivateRoute';
import { PublicRoute } from '@adapters/ui/routes/PublicRoute';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';

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
    path: AppUrl.Login,
  },
  {
    element: (
      <PublicRoute>
        <LoginPasswordlessPage />
      </PublicRoute>
    ),
    path: AppUrl.LoginPasswordless,
  },
  {
    element: <LogoutPage />,
    path: AppUrl.Logout,
  },

  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.MEMBERS}>
        <MembersPage />
      </PrivateRoute>
    ),
    path: AppUrl.Members,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.MEMBERS}>
        <MembersDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.MembersNew,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.MEMBERS}>
        <MembersDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.MembersDetail,
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
    path: AppUrl.Movements,
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
    path: AppUrl.MovementsNew,
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
    path: AppUrl.MovementsDetail,
  },

  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.DUES}>
        <DuesRoot />
      </PrivateRoute>
    ),
    path: AppUrl.Dues,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.DUES}>
        <DueDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.DuesNew,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.DUES}>
        <DueDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.DuesDetail,
  },

  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.PAYMENTS}>
        <PaymentsRoot />
      </PrivateRoute>
    ),
    path: AppUrl.Payments,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.PAYMENTS}>
        <PaymentNewPage />
      </PrivateRoute>
    ),
    path: AppUrl.PaymentsNew,
  },

  {
    element: (
      <PrivateRoute permission={PermissionEnum.READ} scope={ScopeEnum.PAYMENTS}>
        <PaymentDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.PaymentsDetail,
  },

  {
    element: <EnrollPage />,
    path: AppUrl.Enroll,
  },
  {
    element: <VerifyEmailPage />,
    path: AppUrl.VerifyEmail,
  },
]);

export const Routes = () => <RouterProvider router={router} />;
