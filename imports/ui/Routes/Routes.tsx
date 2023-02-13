import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { AppUrl } from '@ui/app.enum';
import { EnrollPage } from '@ui/pages/auth/EnrollPage';
import { LoginPage } from '@ui/pages/auth/LoginPage';
import { LoginPasswordlessPage } from '@ui/pages/auth/LoginPasswordlessPage';
import { LogoutPage } from '@ui/pages/auth/LogoutPage';
import { VerifyEmailPage } from '@ui/pages/auth/VerifyEmailPage';
import { HomePage } from '@ui/pages/HomePage';
import { MembersDetailPage } from '@ui/pages/members/MembersEditPage';
import { MembersPage } from '@ui/pages/members/MembersPage';
import { UsersDetailPage } from '@ui/pages/users/UsersEditPage';
import { UsersPage } from '@ui/pages/users/UsersPage';
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
    element: (
      <PrivateRoute permission={Permission.Read} scope={Scope.Members}>
        <MembersPage />
      </PrivateRoute>
    ),
    path: AppUrl.Members,
  },
  {
    element: (
      <PrivateRoute permission={Permission.Write} scope={Scope.Members}>
        <MembersDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.MembersNew,
  },
  {
    element: (
      <PrivateRoute permission={Permission.Read} scope={Scope.Members}>
        <MembersDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.MembersEdit,
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
