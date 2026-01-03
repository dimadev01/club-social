import { Card, Page } from '@/ui';

import { DuePendingStatisticsCard } from './components/DuePendingStatisticsCard';

export function MemberHomePage() {
  return (
    <Page>
      <Card title="Mi Club Social">
        <DuePendingStatisticsCard dateRange={null} />
      </Card>
    </Page>
  );
}
