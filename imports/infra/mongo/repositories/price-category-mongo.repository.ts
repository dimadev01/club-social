import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { IPriceCategoryRepository } from '@application/prices/repositories/price-category.repository';
import { PriceCategory } from '@domain/prices/models/price-category.model';
import { PriceCategoryAuditableCollection } from '@infra/mongo/collections/price-category-auditable.collection';
import { PriceCategoryMongoCollection } from '@infra/mongo/collections/price-category.collection';
import { PriceCategoryAuditEntity } from '@infra/mongo/entities/price-category-audit.entity';
import { PriceCategoryEntity } from '@infra/mongo/entities/price-category.entity';
import { PriceCategoryMapper } from '@infra/mongo/mappers/price-category.mapper';
import { CrudMongoAuditableRepository } from '@infra/mongo/repositories/common/crud-mongo-auditable.repository';

@injectable()
export class PriceCategoryMongoRepository
  extends CrudMongoAuditableRepository<
    PriceCategory,
    PriceCategoryEntity,
    PriceCategoryAuditEntity
  >
  implements IPriceCategoryRepository
{
  public constructor(
    @inject(DIToken.ILoggerService)
    protected readonly logger: ILoggerService,
    protected readonly collection: PriceCategoryMongoCollection,
    protected readonly mapper: PriceCategoryMapper,
    protected readonly auditableCollection: PriceCategoryAuditableCollection,
  ) {
    super(collection, mapper, logger, auditableCollection);
  }

  public async findByPrice(priceId: string): Promise<PriceCategory[]> {
    const entities = await this.collection.find({ priceId }).fetchAsync();

    return entities.map((entity) => this.mapper.toDomain(entity));
  }
}
