import { DomainEvent } from '@/shared/domain/events/domain-event';

import { PricingEntity } from '../entities/pricing.entity';

export class PricingUpdatedEvent extends DomainEvent {
  public constructor(
    public readonly oldPricing: PricingEntity,
    public readonly pricing: PricingEntity,
  ) {
    super(pricing.id);
  }
}
