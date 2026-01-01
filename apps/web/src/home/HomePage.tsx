import { Space } from 'antd';

import { Page } from '@/ui/Page';

import { MainStatisticsCard } from './components/MainStatisticsCard';
import { PaymentChartCard } from './components/PaymentChartCard';

export function Home() {
  return (
    <Page>
      <Space className="flex" vertical>
        <MainStatisticsCard />
        <PaymentChartCard />
      </Space>
    </Page>
  );
}
