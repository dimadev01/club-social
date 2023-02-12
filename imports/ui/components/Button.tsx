import React from 'react';
import { Button as AntButton, ButtonProps, Tooltip, TooltipProps } from 'antd';

type Props = ButtonProps & {
  tooltip?: TooltipProps;
};

export const Button: React.FC<Props> = ({ children, tooltip, ...props }) => {
  const button = <AntButton {...props}>{children}</AntButton>;

  if (tooltip) {
    return <Tooltip {...tooltip}>{button}</Tooltip>;
  }

  return button;
};
