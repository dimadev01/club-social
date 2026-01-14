import type { DescriptionsProps } from 'antd';

import { Descriptions as AntdDescriptions, Grid } from 'antd';

export function Descriptions({
  bordered = true,
  column = 1,
  layout,
  size = 'small',
  ...props
}: DescriptionsProps) {
  const { sm } = Grid.useBreakpoint();

  const descriptionsLayout = layout ?? (sm ? 'horizontal' : 'vertical');

  return (
    <AntdDescriptions
      bordered={bordered}
      column={column}
      layout={descriptionsLayout}
      size={size}
      {...props}
    />
  );
}

Descriptions.Item = AntdDescriptions.Item;
