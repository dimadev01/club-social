import { Space } from 'antd';

import { MainStatisticsCard } from '@/home/components/MainStatisticsCard';
import { PaymentChartCard } from '@/home/components/PaymentChartCard';
import { Page } from '@/ui';

export function FinanceStatisticsPage() {
  return (
    <Page>
      <Space className="flex" vertical>
        <MainStatisticsCard />
        <PaymentChartCard />
      </Space>
    </Page>
  );
}
