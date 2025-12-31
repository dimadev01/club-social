import { DomainEvent } from '@/shared/domain/events/domain-event';

import { UserEntity } from '../entities/user.entity';

export class UserCreatedEvent extends DomainEvent {
  public constructor(public readonly user: UserEntity) {
    super(user.id);
  }
}
