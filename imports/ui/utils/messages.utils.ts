import { notification } from 'antd';
import { ArgsProps as Props } from 'antd/es/notification';

interface AntNotification {
  error: (config: Props) => void;
}

export abstract class UiNotificationUtils {
  public static errorWithNoContext(message: string, error?: Props): void {
    notification.error({ message, placement: 'top', ...error });
  }

  public static error(
    antNotification: AntNotification,
    message: string,
    error?: Props,
  ): void {
    antNotification.error({ message, placement: 'top', ...error });
  }
}
