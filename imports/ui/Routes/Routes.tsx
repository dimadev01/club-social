import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { AppUrl } from '@ui/app.enum';
import { Home } from '@ui/Home';
import { Login } from '@ui/Login';
import { Logout } from '@ui/Logout';
import { PrivateRoute } from '@ui/Routes/PrivateRoute';

const router = createBrowserRouter([
  {
    element: (
      <PrivateRoute scope={Scope.Users} permission={Permission.Read}>
        <Home />
      </PrivateRoute>
    ),
    path: AppUrl.HOME,
  },
  {
    element: <Login />,
    path: AppUrl.LOGIN,
  },
  {
    element: <Logout />,
    path: AppUrl.LOGOUT,
  },
]);

export const Routes = () => <RouterProvider router={router} />;
