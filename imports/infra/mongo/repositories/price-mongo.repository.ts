import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@application/common/repositories/grid.repository';
import { IPriceRepository } from '@application/prices/repositories/price.repository';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { Price } from '@domain/prices/models/price.model';
import { PriceAuditableCollection } from '@infra/mongo/collections/price-auditable.collection';
import { PriceMongoCollection } from '@infra/mongo/collections/price.collection';
import { PriceAuditEntity } from '@infra/mongo/entities/price-audit.entity';
import { PriceEntity } from '@infra/mongo/entities/price.entity';
import { PriceMapper } from '@infra/mongo/mappers/price.mapper';
import { CrudMongoAuditableRepository } from '@infra/mongo/repositories/common/crud-mongo-auditable.repository';

@injectable()
export class PriceMongoRepository
  extends CrudMongoAuditableRepository<Price, PriceEntity, PriceAuditEntity>
  implements IPriceRepository
{
  public constructor(
    @inject(DIToken.ILoggerService)
    protected readonly logger: ILoggerService,
    protected readonly collection: PriceMongoCollection,
    protected readonly mapper: PriceMapper,
    protected readonly auditableCollection: PriceAuditableCollection,
  ) {
    super(collection, mapper, logger, auditableCollection);
  }

  public async findOneByCategory(
    dueCategory: DueCategoryEnum,
  ): Promise<Price | null> {
    const entity = await this.collection.findOneAsync({
      dueCategory,
      isDeleted: false,
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toDomain(entity);
  }

  public async findPaginated(
    request: FindPaginatedRequest,
  ): Promise<FindPaginatedResponse<Price>> {
    const pipeline: Document[] = [
      ...this.getPaginatedPipeline(request),
      {
        $lookup: {
          as: 'categories',
          foreignField: 'priceId',
          from: 'price.categories',
          localField: '_id',
        },
      },
    ];

    return super.paginate(pipeline, {});
  }
}
