import { DomainEvent } from '@/shared/domain/events/domain-event';

import { NotificationEntity } from '../entities/notification.entity';

export class NotificationCreatedEvent extends DomainEvent {
  public constructor(public readonly notification: NotificationEntity) {
    super(notification.id);
  }
}
