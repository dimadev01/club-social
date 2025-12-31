import { DomainEvent } from '@/shared/domain/events/domain-event';

import { DueEntity } from '../entities/due.entity';

export class DueUpdatedEvent extends DomainEvent {
  public constructor(
    public readonly oldDue: DueEntity,
    public readonly due: DueEntity,
  ) {
    super(due.id);
  }
}
