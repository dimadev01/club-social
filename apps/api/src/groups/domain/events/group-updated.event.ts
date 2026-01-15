import { DomainEvent } from '@/shared/domain/events/domain-event';

import { GroupEntity } from '../entities/group.entity';

export class GroupUpdatedEvent extends DomainEvent {
  public constructor(
    public readonly oldGroup: GroupEntity,
    public readonly newGroup: GroupEntity,
  ) {
    super(newGroup.id);
  }
}
