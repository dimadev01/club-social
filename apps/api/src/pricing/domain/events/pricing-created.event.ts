import { DomainEvent } from '@/shared/domain/events/domain-event';

import { PricingEntity } from '../entities/pricing.entity';

export class PricingCreatedEvent extends DomainEvent {
  public constructor(public readonly pricing: PricingEntity) {
    super(pricing.id);
  }
}
