import { Spin } from 'antd';

import { CenteredLayout } from '@/components/CenteredLayout';

export function AppLoading() {
  return (
    <CenteredLayout>
      <Spin size="large" />
    </CenteredLayout>
  );
}
