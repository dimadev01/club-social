import { App } from 'antd';
import { ArgsProps } from 'antd/es/notification';

export const useNotificationError = () => {
  const { notification } = App.useApp();

  return (message: string, props?: ArgsProps) =>
    notification.error({ message, placement: 'top', ...props });
};

export const useNotificationSuccess = () => {
  const { notification } = App.useApp();

  return (message: string, props?: ArgsProps) =>
    notification.success({ message, placement: 'top', ...props });
};
