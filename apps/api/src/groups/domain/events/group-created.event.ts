import { DomainEvent } from '@/shared/domain/events/domain-event';

import { GroupEntity } from '../entities/group.entity';

export class GroupCreatedEvent extends DomainEvent {
  public constructor(public readonly group: GroupEntity) {
    super(group.id);
  }
}
