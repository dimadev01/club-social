import { DomainEvent } from '@/shared/domain/events/domain-event';

import { MovementEntity } from '../entities/movement.entity';

export class MovementUpdatedEvent extends DomainEvent {
  public constructor(
    public readonly oldMovement: MovementEntity,
    public readonly movement: MovementEntity,
  ) {
    super(movement.id);
  }
}
