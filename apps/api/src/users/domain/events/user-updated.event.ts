import { DomainEvent } from '@/shared/domain/events/domain-event';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { UpdateUserProfileProps } from '../interfaces/user.interface';

export class UserUpdatedEvent extends DomainEvent {
  public constructor(
    protected readonly userId: UniqueId,
    public readonly changes: UpdateUserProfileProps,
  ) {
    super(userId);
  }
}
