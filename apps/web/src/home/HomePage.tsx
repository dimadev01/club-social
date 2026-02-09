import { UserRole } from '@club-social/shared/users';
import { Space } from 'antd';

import { useSessionUser } from '@/auth/useUser';
import { Page } from '@/ui';

import { HomeSummaryCard } from './components/HomeSummaryCard';
import { QuickActionsCard } from './components/QuickActionsCard';
import { MemberHomePage } from './MemberHomePage';

export function HomePage() {
  const user = useSessionUser();

  if (user.role === UserRole.MEMBER) {
    return <MemberHomePage />;
  }

  return (
    <Page>
      <Space className="flex" vertical>
        <QuickActionsCard />
        <HomeSummaryCard />
      </Space>
    </Page>
  );
}
