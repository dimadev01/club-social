import { Divider, Space } from 'antd';

import { MainStatisticsCard } from '@/home/components/MainStatisticsCard';
import { PaymentChartCard } from '@/home/components/PaymentChartCard';
import { Page, PageHeader, PageTitle } from '@/ui';

import { CollectionRateCard } from './components/CollectionRateCard';
import { DebtAgingCard } from './components/DebtAgingCard';
import { RevenueTrendChart } from './components/RevenueTrendChart';

export function FinanceStatisticsPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Estadísticas de Finanzas</PageTitle>
      </PageHeader>
      <Space className="flex" vertical>
        <MainStatisticsCard />
        <Divider />
        <RevenueTrendChart />
        <Divider />
        <CollectionRateCard />
        <Divider />
        <DebtAgingCard />
        <Divider />
        <PaymentChartCard />
      </Space>
    </Page>
  );
}
