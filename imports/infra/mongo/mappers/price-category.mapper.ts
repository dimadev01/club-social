import { injectable } from 'tsyringe';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { PriceCategory } from '@domain/prices/models/price-category.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { PriceCategoryEntity } from '@infra/mongo/entities/price-category.entity';

@injectable()
export class PriceCategoryMapper extends Mapper<
  PriceCategory,
  PriceCategoryEntity
> {
  public constructor() {
    super();
  }

  public toDomain(entity: PriceCategoryEntity): PriceCategory {
    return new PriceCategory({
      _id: entity._id,
      amount: Money.from({ amount: entity.amount }),
      createdAt: new DateTimeVo(entity.createdAt),
      createdBy: entity.createdBy,
      deletedAt: entity.deletedAt ? new DateTimeVo(entity.deletedAt) : null,
      deletedBy: entity.deletedBy,
      isDeleted: entity.isDeleted,
      memberCategory: entity.memberCategory,
      priceId: entity.priceId,
      updatedAt: new DateTimeVo(entity.updatedAt),
      updatedBy: entity.updatedBy,
    });
  }

  protected getEntity(domain: PriceCategory): PriceCategoryEntity {
    return new PriceCategoryEntity({
      _id: domain._id,
      amount: domain.amount.amount,
      createdAt: domain.createdAt.date,
      createdBy: domain.createdBy,
      deletedAt: domain.deletedAt?.date ?? null,
      deletedBy: domain.deletedBy,
      isDeleted: domain.isDeleted,
      memberCategory: domain.memberCategory,
      priceId: domain.priceId,
      updatedAt: domain.updatedAt.date,
      updatedBy: domain.updatedBy,
    });
  }
}
