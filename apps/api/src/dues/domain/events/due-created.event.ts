import { DomainEvent } from '@/shared/domain/events/domain-event';

import { DueEntity } from '../entities/due.entity';

export class DueCreatedEvent extends DomainEvent {
  public constructor(public readonly due: DueEntity) {
    super(due.id);
  }
}
