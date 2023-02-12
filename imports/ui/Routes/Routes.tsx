import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { AppUrl } from '@ui/app.enum';
import { EnrollPage } from '@ui/pages/EnrollPage';
import { HomePage } from '@ui/pages/HomePage';
import { LoginPage } from '@ui/pages/LoginPage';
import { LogoutPage } from '@ui/pages/LogoutPage';
import { UsersDetailPage } from '@ui/pages/UsersEditPage';
import { UsersPage } from '@ui/pages/UsersPage';
import { VerifyEmailPage } from '@ui/pages/VerifyEmailPage';
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
    path: AppUrl.Login,
  },
  {
    element: <LogoutPage />,
    path: AppUrl.Logout,
  },
  {
    element: (
      <PrivateRoute permission={Permission.Read} scope={Scope.Users}>
        <UsersPage />
      </PrivateRoute>
    ),
    path: AppUrl.Users,
  },
  {
    element: (
      <PrivateRoute permission={Permission.Write} scope={Scope.Users}>
        <UsersDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.UsersNew,
  },
  {
    element: (
      <PrivateRoute permission={Permission.Read} scope={Scope.Users}>
        <UsersDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.UsersEdit,
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
