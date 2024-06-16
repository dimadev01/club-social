import React from 'react';
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl, AppUrlGenericEnum } from '@ui/app.enum';
import { CenteredLayout } from '@ui/components/Layout/CenteredLayout';
import { LoginPage } from '@ui/pages/auth/LoginPage';
import { LoginPasswordlessPage } from '@ui/pages/auth/LoginPasswordlessPage';
import { LogoutPage } from '@ui/pages/auth/LogoutPage';
import { DueDetailPage } from '@ui/pages/dues/DueDetailPage';
import { DueEditPage } from '@ui/pages/dues/DueEditPage';
import { DuesNewPage } from '@ui/pages/dues/DuesNewPage';
import { DuesPage } from '@ui/pages/dues/DuesPage';
import { HomePage } from '@ui/pages/HomePage';
import { MemberDetailPage } from '@ui/pages/members/MemberDetailPage';
import { MembersPage } from '@ui/pages/members/MembersPage';
import { MovementDetailPage } from '@ui/pages/movements/MovementDetailPage';
import { MovementEditPage } from '@ui/pages/movements/MovementEditPage';
import { MovementNewPage } from '@ui/pages/movements/MovementNewPage';
import { MovementsPage } from '@ui/pages/movements/MovementsPage';
import { PaymentDetailPage } from '@ui/pages/payments/PaymentDetailPage';
import { PaymentNewPage } from '@ui/pages/payments/PaymentNewPage';
import { PaymentsPage } from '@ui/pages/payments/PaymentsPage';
import { AuthRoute } from '@ui/routes/AuthRoute';
import { PrivateRoute } from '@ui/routes/PrivateRoute2';
import { PublicRoute } from '@ui/routes/PublicRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={AppUrl.HOME} element={<AuthRoute />}>
        <Route index element={<HomePage />} />

        <Route path={AppUrl.MEMBERS} element={<Outlet />}>
          <Route
            index
            element={
              <PrivateRoute
                scope={ScopeEnum.MEMBERS}
                permission={PermissionEnum.READ}
                element={<MembersPage />}
              />
            }
          />

          <Route
            path={AppUrlGenericEnum.ID}
            element={
              <PrivateRoute
                scope={ScopeEnum.MEMBERS}
                permission={PermissionEnum.UPDATE}
                element={<MemberDetailPage />}
              />
            }
          />
          <Route
            path={AppUrlGenericEnum.NEW}
            element={
              <PrivateRoute
                scope={ScopeEnum.MEMBERS}
                permission={PermissionEnum.CREATE}
                element={<MemberDetailPage />}
              />
            }
          />
        </Route>

        <Route path={AppUrl.DUES} element={<Outlet />}>
          <Route
            index
            element={
              <PrivateRoute
                scope={ScopeEnum.DUES}
                permission={PermissionEnum.READ}
                element={<DuesPage />}
              />
            }
          />
          <Route
            path={AppUrlGenericEnum.NEW}
            element={
              <PrivateRoute
                scope={ScopeEnum.DUES}
                permission={PermissionEnum.CREATE}
                element={<DuesNewPage />}
              />
            }
          />
          <Route path={AppUrlGenericEnum.ID} element={<Outlet />}>
            <Route
              index
              element={
                <PrivateRoute
                  scope={ScopeEnum.DUES}
                  permission={PermissionEnum.READ}
                  element={<DueDetailPage />}
                />
              }
            />
            <Route
              path={AppUrlGenericEnum.EDIT}
              element={
                <PrivateRoute
                  scope={ScopeEnum.DUES}
                  permission={PermissionEnum.UPDATE}
                  element={<DueEditPage />}
                />
              }
            />
          </Route>
        </Route>

        <Route path={AppUrl.PAYMENTS} element={<Outlet />}>
          <Route
            index
            element={
              <PrivateRoute
                scope={ScopeEnum.PAYMENTS}
                permission={PermissionEnum.READ}
                element={<PaymentsPage />}
              />
            }
          />
          <Route
            path={AppUrlGenericEnum.NEW}
            element={
              <PrivateRoute
                scope={ScopeEnum.PAYMENTS}
                permission={PermissionEnum.CREATE}
                element={<PaymentNewPage />}
              />
            }
          />
          <Route path={AppUrlGenericEnum.ID} element={<Outlet />}>
            <Route
              index
              element={
                <PrivateRoute
                  scope={ScopeEnum.PAYMENTS}
                  permission={PermissionEnum.READ}
                  element={<PaymentDetailPage />}
                />
              }
            />
          </Route>
        </Route>

        <Route path={AppUrl.MOVEMENTS} element={<Outlet />}>
          <Route
            index
            element={
              <PrivateRoute
                scope={ScopeEnum.MOVEMENTS}
                permission={PermissionEnum.READ}
                element={<MovementsPage />}
              />
            }
          />
          <Route
            path={AppUrlGenericEnum.NEW}
            element={
              <PrivateRoute
                scope={ScopeEnum.MOVEMENTS}
                permission={PermissionEnum.CREATE}
                element={<MovementNewPage />}
              />
            }
          />
          <Route path={AppUrlGenericEnum.ID} element={<Outlet />}>
            <Route
              index
              element={
                <PrivateRoute
                  scope={ScopeEnum.MOVEMENTS}
                  permission={PermissionEnum.UPDATE}
                  element={<MovementDetailPage />}
                />
              }
            />
            <Route
              path={AppUrlGenericEnum.EDIT}
              element={
                <PrivateRoute
                  scope={ScopeEnum.MOVEMENTS}
                  permission={PermissionEnum.UPDATE}
                  element={<MovementEditPage />}
                />
              }
            />
          </Route>
        </Route>
      </Route>

      <Route path={AppUrl.AUTH}>
        <Route path={AppUrl.AUTH_LOGOUT} element={<LogoutPage />} />,
        <Route element={<PublicRoute />}>
          <Route path={AppUrl.AUTH_LOGIN} element={<CenteredLayout />}>
            <Route index element={<LoginPage />} />
            <Route
              path={AppUrl.AUTH_LOGIN_PASSWORDLESS}
              element={<LoginPasswordlessPage />}
            />
          </Route>
        </Route>
      </Route>
    </>,
  ),
);

export const Routes = () => <RouterProvider router={router} />;
