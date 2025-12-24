import type { DescriptionsProps } from 'antd';

import { Descriptions as AntdDescriptions, Grid } from 'antd';

export function Descriptions({
  bordered = true,
  column = 1,
  size = 'small',
  ...props
}: DescriptionsProps & { bordered?: boolean }) {
  const { md } = Grid.useBreakpoint();

  return (
    <AntdDescriptions
      bordered={bordered}
      column={column}
      layout={md ? 'horizontal' : 'vertical'}
      size={size}
      {...props}
    />
  );
}

Descriptions.Item = AntdDescriptions.Item;
