import { DomainEvent } from '@/shared/domain/events/domain-event';

import { UserEntity } from '../entities/user.entity';

export class UserUpdatedEvent extends DomainEvent {
  public constructor(
    public readonly oldUser: UserEntity,
    public readonly user: UserEntity,
  ) {
    super(user.id);
  }
}
