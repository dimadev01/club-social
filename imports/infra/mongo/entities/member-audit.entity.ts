import { AuditableEntity } from '@infra/mongo/common/entities/auditable.entity';
import { MemberEntity } from '@infra/mongo/entities/member.entity';

export class MemberAuditEntity extends AuditableEntity<MemberEntity> {}
