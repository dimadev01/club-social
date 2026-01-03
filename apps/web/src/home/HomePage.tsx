import { UserRole } from '@club-social/shared/users';
import { Space } from 'antd';

import { useSessionUser } from '@/auth/useUser';
import { Page } from '@/ui/Page';

import { MainStatisticsCard } from './components/MainStatisticsCard';
import { PaymentChartCard } from './components/PaymentChartCard';
import { MemberHomePage } from './MemberHomePage';

export function HomePage() {
  const user = useSessionUser();

  if (user.role === UserRole.MEMBER) {
    return <MemberHomePage />;
  }

  return (
    <Page>
      <Space className="flex" vertical>
        <MainStatisticsCard />
        <PaymentChartCard />
      </Space>
    </Page>
  );
}
