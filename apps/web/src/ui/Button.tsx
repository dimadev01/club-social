import type { ButtonProps, TooltipProps } from 'antd';

import { Button as AntButton, Tooltip } from 'antd';

interface Props extends ButtonProps {
  tooltip?: TooltipProps | TooltipProps['title'];
}

export function Button(props: Props) {
  const { tooltip, ...rest } = props;

  if (tooltip) {
    let title: string | undefined;

    if (typeof tooltip === 'string') {
      title = tooltip;
    }

    return (
      <Tooltip title={title} {...(typeof tooltip === 'object' ? tooltip : {})}>
        <AntButton {...rest} />
      </Tooltip>
    );
  }

  return <AntButton {...props} />;
}
