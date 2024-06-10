import { AuditableEntity } from '@infra/mongo/common/entities/auditable.entity';
import { MovementEntity } from '@infra/mongo/entities/movement.entity';

export class MovementAuditEntity extends AuditableEntity<MovementEntity> {}
