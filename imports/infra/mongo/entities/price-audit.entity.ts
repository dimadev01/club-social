import { AuditableEntity } from '@infra/mongo/common/entities/auditable.entity';
import { PriceEntity } from '@infra/mongo/entities/price.entity';

export class PriceAuditEntity extends AuditableEntity<PriceEntity> {}
