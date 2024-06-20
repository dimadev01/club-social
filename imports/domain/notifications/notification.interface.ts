import { IModel } from '@domain/common/models/model.interface';

export interface INotification extends IModel {
  action: INotificationActionEnum;
  actorId: string;
  actorName: string;
  message: string;
  readAt: Date | null;
  receiverId: string;
  receiverName: string;
  resourceId: string;
  status: INotificationStatusEnum;
  subject: string;
  type: INotificationEntityEnum;
}

export interface INotificationTemplate {
  action: INotificationActionEnum;
  entity: INotificationEntityEnum;
  message: string;
  subject: string;
}

export interface CreateNotification {
  action: INotificationActionEnum;
  actorId: string;
  actorName: string;
  message: string;
  receiverId: string;
  receiverName: string;
  resourceId: string;
  subject: string;
  type: INotificationEntityEnum;
}

export enum INotificationStatusEnum {
  READ = 'read',
  UNREAD = 'unread',
}

export enum INotificationEntityEnum {
  DUE = 'due',
  PAYMENT = 'payment',
}

export enum INotificationActionEnum {
  CREATION = 'creation',
}

export enum INotificationChannelEnum {
  EMAIL = 'email',
  IN_APP = 'in-app',
}

export const NotificationTemplates: INotificationTemplate[] = [
  {
    action: INotificationActionEnum.CREATION,
    entity: INotificationEntityEnum.DUE,
    message: '{{actorName}} ha generado una nueva deuda de {{amount}}',
    subject: 'Nueva deuda',
  },
  {
    action: INotificationActionEnum.CREATION,
    entity: INotificationEntityEnum.DUE,
    message: '{{actorName}} ha registrado un nuevo pago de {{amount}}',
    subject: 'Nuevo pago',
  },
];
