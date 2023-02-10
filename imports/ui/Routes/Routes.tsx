import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';
import { Home } from '@ui/Home';
import { Login } from '@ui/Login';
import { PrivateRoute } from '@ui/Routes/PrivateRoute';

const router = createBrowserRouter([
  {
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
    path: AppUrl.HOME,
  },
  {
    element: <Login />,
    path: AppUrl.LOGIN,
  },
]);

export const Routes = () => <RouterProvider router={router} />;
