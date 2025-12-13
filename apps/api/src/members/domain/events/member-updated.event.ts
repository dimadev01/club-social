import { DomainEvent } from '@/shared/domain/events/domain-event';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { UpdateMemberProfileProps } from '../interfaces/member.interface';

export class MemberUpdatedEvent extends DomainEvent {
  public constructor(
    protected readonly memberId: UniqueId,
    public readonly changes: UpdateMemberProfileProps,
  ) {
    super(memberId);
  }
}
