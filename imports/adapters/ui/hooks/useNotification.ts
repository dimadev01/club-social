import { App } from 'antd';
import { ArgsProps } from 'antd/es/notification';

export const useNotificationError = () => {
  const { notification } = App.useApp();

  return ({ message, ...rest }: ArgsProps) =>
    notification.error({ message, placement: 'top', ...rest });
};
