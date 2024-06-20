import { IModel } from '@domain/common/models/model.interface';
import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import {
  NotificationResourceEnum,
  NotificationStatusEnum,
} from '@domain/notifications/notification.enum';

export interface INotification extends IModel {
  message: string;
  readAt: DateTimeVo | null;
  receiverId: string;
  receiverName: string;
  resource: NotificationResourceEnum;
  resourceId: string;
  status: NotificationStatusEnum;
  subject: string;
}

export interface CreateNotification {
  message: string;
  receiverId: string;
  receiverName: string;
  resource: NotificationResourceEnum;
  resourceId: string;
  subject: string;
}
