import { Divider, Space } from 'antd';

import { MainStatisticsCard } from '@/home/components/MainStatisticsCard';
import { PaymentChartCard } from '@/home/components/PaymentChartCard';
import { Page, PageHeader, PageTitle } from '@/ui';

export function FinanceStatisticsPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Estadísticas de Finanzas</PageTitle>
      </PageHeader>
      <Space className="flex" vertical>
        <MainStatisticsCard />
        <Divider />
        <PaymentChartCard />
      </Space>
    </Page>
  );
}
