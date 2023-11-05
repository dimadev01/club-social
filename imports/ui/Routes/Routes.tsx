import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PermissionEnum, ScopeEnum } from '@domain/roles/roles.enum';
import { AppUrl } from '@ui/app.enum';
import { EnrollPage } from '@ui/pages/auth/EnrollPage';
import { LoginPage } from '@ui/pages/auth/LoginPage';
import { LoginPasswordlessPage } from '@ui/pages/auth/LoginPasswordlessPage';
import { LogoutPage } from '@ui/pages/auth/LogoutPage';
import { VerifyEmailPage } from '@ui/pages/auth/VerifyEmailPage';
import { CategoriesPage } from '@ui/pages/categories/CategoriesPage';
import { CategoryDetailPage } from '@ui/pages/categories/CategoryDetailPage';
import { EmployeesPage } from '@ui/pages/employees/EmployeesPage';
import { HomePage } from '@ui/pages/HomePage';
import { MembersDetailPage } from '@ui/pages/members/MemberDetailPage/MemberDetailPage';
import { MembersPage } from '@ui/pages/members/MembersPage';
import { MovementDetailPage } from '@ui/pages/movements/MovementDetailPage';
import { MovementsRoot } from '@ui/pages/movements/MovementsRoot';
import { ProfessorsPage } from '@ui/pages/professors/ProfessorsPage';
import { ServicesPage } from '@ui/pages/services/ServicesPage';
import { UsersDetailPage } from '@ui/pages/users/UsersDetailPage';
import { UsersPage } from '@ui/pages/users/UsersPage';
import { AuthRoute } from '@ui/Routes/AuthRoute';
import { PrivateRoute } from '@ui/Routes/PrivateRoute';
import { PublicRoute } from '@ui/Routes/PublicRoute';

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
      <PrivateRoute permission={PermissionEnum.Read} scope={ScopeEnum.Users}>
        <UsersPage />
      </PrivateRoute>
    ),
    path: AppUrl.Users,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.Read} scope={ScopeEnum.Users}>
        <UsersDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.UsersNew,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.Read} scope={ScopeEnum.Users}>
        <UsersDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.UsersDetail,
  },

  {
    element: (
      <PrivateRoute permission={PermissionEnum.Read} scope={ScopeEnum.Members}>
        <MembersPage />
      </PrivateRoute>
    ),
    path: AppUrl.Members,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.Read} scope={ScopeEnum.Members}>
        <MembersDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.MembersNew,
  },
  {
    element: (
      <PrivateRoute permission={PermissionEnum.Read} scope={ScopeEnum.Members}>
        <MembersDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.MembersDetail,
  },

  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.Read}
        scope={ScopeEnum.Movements}
      >
        <MovementsRoot />
      </PrivateRoute>
    ),
    path: AppUrl.Movements,
  },
  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.Read}
        scope={ScopeEnum.Movements}
      >
        <MovementDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.MovementsNew,
  },
  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.Read}
        scope={ScopeEnum.Movements}
      >
        <MovementDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.MovementsDetail,
  },

  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.Read}
        scope={ScopeEnum.Professors}
      >
        <ProfessorsPage />
      </PrivateRoute>
    ),
    path: AppUrl.Professors,
  },

  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.Read}
        scope={ScopeEnum.Employees}
      >
        <EmployeesPage />
      </PrivateRoute>
    ),
    path: AppUrl.Employees,
  },

  {
    element: (
      <PrivateRoute permission={PermissionEnum.Read} scope={ScopeEnum.Services}>
        <ServicesPage />
      </PrivateRoute>
    ),
    path: AppUrl.Services,
  },

  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.Read}
        scope={ScopeEnum.Categories}
      >
        <CategoriesPage />
      </PrivateRoute>
    ),
    path: AppUrl.Categories,
  },
  {
    element: (
      <PrivateRoute
        permission={PermissionEnum.Read}
        scope={ScopeEnum.Categories}
      >
        <CategoryDetailPage />
      </PrivateRoute>
    ),
    path: AppUrl.CategoriesDetail,
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
