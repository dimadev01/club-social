import { Spin } from 'antd';

import { CenteredLayout } from '@/ui/CenteredLayout';

export function AppLoading() {
  return (
    <CenteredLayout>
      <Spin size="large" />
    </CenteredLayout>
  );
}
