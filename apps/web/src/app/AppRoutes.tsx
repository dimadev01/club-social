import { BrowserRouter, Route, Routes } from 'react-router';

import { AppSettingsPage } from '@/app-settings/AppSettingsPage';
import { AuditLogsList } from '@/audit-logs/AuditLogsList';
import { LoginPage } from '@/auth/LoginPage';
import { LogoutPage } from '@/auth/LogoutPage';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { DueEdit } from '@/dues/DueEdit';
import { DueList } from '@/dues/DueList';
import { DueNew } from '@/dues/DueNew';
import { DueView } from '@/dues/DueView';
import { GroupEdit } from '@/groups/GroupEdit';
import { GroupList } from '@/groups/GroupList';
import { GroupNew } from '@/groups/GroupNew';
import { GroupView } from '@/groups/GroupView';
import { HomePage } from '@/home/HomePage';
import { MemberLedgerList } from '@/member-ledger/MemberLedgerList';
import { MemberLedgerNew } from '@/member-ledger/MemberLedgerNew';
import { MemberLedgerView } from '@/member-ledger/MemberLedgerView';
import { MemberEdit } from '@/members/MemberEdit';
import { MemberListPage } from '@/members/MemberList';
import { MemberNew } from '@/members/MemberNew';
import { MemberView } from '@/members/MemberView';
import { MovementList } from '@/movements/MovementList';
import { MovementNew } from '@/movements/MovementNew';
import { MovementView } from '@/movements/MovementView';
import { PaymentList } from '@/payments/PaymentList';
import { PaymentNew } from '@/payments/PaymentNew';
import { PaymentView } from '@/payments/PaymentView';
import { PricingEdit } from '@/pricing/PricingEdit';
import { PricingList } from '@/pricing/PricingList';
import { PricingNew } from '@/pricing/PricingNew';
import { PricingView } from '@/pricing/PricingView';
import { ProfilePage } from '@/profile/ProfilePage';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { NotFound } from '@/ui';
import { UserEdit } from '@/users/UserEdit';
import { UserListPage } from '@/users/UserList';
import { UserNew } from '@/users/UserNew';
import { UserView } from '@/users/UserView';

import { appRoutes } from './app.enum';
import { AppLoading } from './AppLoading';

export function AppRoutes() {
  const { isPending } = betterAuthClient.useSession();

  if (isPending) {
    return <AppLoading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<HomePage />} path={appRoutes.home} />

          <Route path={appRoutes.users.list}>
            <Route element={<UserListPage />} index />
            <Route element={<UserNew />} path={appRoutes.generic.new} />
            <Route element={<UserView />} path={appRoutes.generic.view} />
            <Route element={<UserEdit />} path={appRoutes.generic.edit} />
          </Route>

          <Route path={appRoutes.memberLedger.list}>
            <Route element={<MemberLedgerList />} index />
            <Route element={<MemberLedgerNew />} path={appRoutes.generic.new} />
            <Route
              element={<MemberLedgerView />}
              path={appRoutes.generic.view}
            />
          </Route>

          <Route path={appRoutes.members.list}>
            <Route element={<MemberListPage />} index />
            <Route element={<MemberNew />} path={appRoutes.generic.new} />
            <Route element={<MemberView />} path={appRoutes.generic.view} />
            <Route element={<MemberEdit />} path={appRoutes.generic.edit} />
          </Route>

          <Route path={appRoutes.dues.list}>
            <Route element={<DueList />} index />
            <Route element={<DueNew />} path={appRoutes.generic.new} />
            <Route element={<DueView />} path={appRoutes.generic.view} />
            <Route element={<DueEdit />} path={appRoutes.generic.edit} />
          </Route>

          <Route path={appRoutes.groups.list}>
            <Route element={<GroupList />} index />
            <Route element={<GroupNew />} path={appRoutes.generic.new} />
            <Route element={<GroupView />} path={appRoutes.generic.view} />
            <Route element={<GroupEdit />} path={appRoutes.generic.edit} />
          </Route>

          <Route path={appRoutes.movements.list}>
            <Route element={<MovementList />} index />
            <Route element={<MovementNew />} path={appRoutes.generic.new} />
            <Route element={<MovementView />} path={appRoutes.generic.view} />
          </Route>

          <Route path={appRoutes.payments.list}>
            <Route element={<PaymentList />} index />
            <Route element={<PaymentNew />} path={appRoutes.generic.new} />
            <Route element={<PaymentView />} path={appRoutes.generic.view} />
          </Route>

          <Route path={appRoutes.pricing.list}>
            <Route element={<PricingList />} index />
            <Route element={<PricingNew />} path={appRoutes.generic.new} />
            <Route element={<PricingEdit />} path={appRoutes.generic.edit} />
            <Route element={<PricingView />} path={appRoutes.generic.view} />
          </Route>

          <Route path={appRoutes.auditLogs.list}>
            <Route element={<AuditLogsList />} index />
          </Route>

          <Route element={<ProfilePage />} path={appRoutes.profile} />
          <Route element={<AppSettingsPage />} path={appRoutes.appSettings} />
        </Route>

        <Route path={appRoutes.auth.root}>
          <Route element={<LoginPage />} path={appRoutes.auth.login} />
          <Route element={<LogoutPage />} path={appRoutes.auth.logout} />
        </Route>

        <Route element={<NotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
