import { ICrudRepository } from '@application/common/repositories/crud.repository';
import { Notification } from '@domain/notifications/models/notification.model';

export type INotificationRepository = ICrudRepository<Notification>;
