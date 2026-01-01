import { DomainEvent } from '@/shared/domain/events/domain-event';
import { UserEntity } from '@/users/domain/entities/user.entity';

import { MemberEntity } from '../entities/member.entity';

export class MemberCreatedEvent extends DomainEvent {
  public constructor(
    public readonly member: MemberEntity,
    public readonly user: UserEntity,
  ) {
    super(member.id);
  }
}
