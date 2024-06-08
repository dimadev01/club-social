import {
  Button as AntButton,
  ButtonProps,
  Popconfirm,
  PopconfirmProps,
  Tooltip,
  TooltipProps,
} from 'antd';
import React from 'react';

type Props = ButtonProps & {
  popConfirm?: PopconfirmProps;
  tooltip?: TooltipProps;
};

export const Button: React.FC<Props> = ({
  children,
  tooltip,
  popConfirm,
  ...props
}) => {
  let button = <AntButton {...props}>{children}</AntButton>;

  if (tooltip) {
    button = <Tooltip {...tooltip}>{button}</Tooltip>;
  }

  if (popConfirm) {
    button = <Popconfirm {...popConfirm}>{button}</Popconfirm>;
  }

  return button;
};
