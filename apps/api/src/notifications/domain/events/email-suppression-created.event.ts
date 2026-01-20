import { DomainEvent } from '@/shared/domain/events/domain-event';

import { EmailSuppressionEntity } from '../entities/email-suppression.entity';

export class EmailSuppressionCreatedEvent extends DomainEvent {
  public constructor(public readonly emailSuppression: EmailSuppressionEntity) {
    super(emailSuppression.id);
  }
}
