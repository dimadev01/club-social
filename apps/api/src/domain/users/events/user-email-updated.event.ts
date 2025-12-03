import { DomainEvent } from '@/domain/shared/events/domain-event';

import { UserEntity } from '../user.entity';

export class UserEmailUpdatedEvent extends DomainEvent {
  public constructor(public readonly user: UserEntity) {
    super(user.id);
  }
}
