import { AuditableEntity } from '@adapters/common/entities/auditable.entity';
import { MemberEntity } from '@adapters/members/entities/member.entity';

export class MemberAuditEntity extends AuditableEntity<MemberEntity> {}
