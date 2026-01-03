import { Spin } from 'antd';

import { CenteredLayout } from '@/ui';

export function AppLoading() {
  return (
    <CenteredLayout>
      <Spin size="large" />
    </CenteredLayout>
  );
}
