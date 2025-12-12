import { DomainEvent } from '@/domain/shared/events/domain-event';
import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';

import { UpdateUserProfileProps } from '../user.interface';

export class UserUpdatedEvent extends DomainEvent {
  public constructor(
    protected readonly userId: UniqueId,
    public readonly changes: UpdateUserProfileProps,
  ) {
    super(userId);
  }
}
