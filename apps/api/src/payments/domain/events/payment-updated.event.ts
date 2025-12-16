import { DomainEvent } from '@/shared/domain/events/domain-event';

import { PaymentEntity } from '../entities/payment.entity';

export class PaymentUpdatedEvent extends DomainEvent {
  public constructor(public readonly payment: PaymentEntity) {
    super(payment.id);
  }
}
