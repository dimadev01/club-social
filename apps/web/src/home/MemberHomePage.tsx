import { Card } from '@/ui/Card';
import { Page } from '@/ui/Page';

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
