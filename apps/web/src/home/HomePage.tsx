import { UserRole } from '@club-social/shared/users';
import { Space } from 'antd';

import { useSessionUser } from '@/auth/useUser';
import { Page, PageHeader, PageTitle } from '@/ui';

import { HomeSummaryCards } from './components/HomeSummaryCards';
import { QuickActionsCards } from './components/QuickActionsCards';
import { MemberHomePage } from './MemberHomePage';

export function HomePage() {
  const user = useSessionUser();

  if (user.role === UserRole.MEMBER) {
    return <MemberHomePage />;
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>Club Social Monte Grande</PageTitle>
      </PageHeader>
      <Space className="flex" vertical>
        <QuickActionsCards />
        <HomeSummaryCards />
      </Space>
    </Page>
  );
}
