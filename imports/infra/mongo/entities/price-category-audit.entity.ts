import { AuditableEntity } from '@infra/mongo/common/entities/auditable.entity';
import { PriceCategoryEntity } from '@infra/mongo/entities/price-category.entity';

export class PriceCategoryAuditEntity extends AuditableEntity<PriceCategoryEntity> {}
