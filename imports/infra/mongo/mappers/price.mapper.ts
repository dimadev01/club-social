import { injectable } from 'tsyringe';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { Price } from '@domain/prices/models/price.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { PriceEntity } from '@infra/mongo/entities/price.entity';

@injectable()
export class PriceMapper extends Mapper<Price, PriceEntity> {
  public constructor() {
    super();
  }

  public toDomain(entity: PriceEntity): Price {
    return new Price({
      _id: entity._id,
      amount: Money.from({ amount: entity.amount }),
      categories: entity.categories.map((category) => ({
        amount: Money.from({ amount: category.amount }),
        category: category.category,
      })),
      createdAt: new DateTimeVo(entity.createdAt),
      createdBy: entity.createdBy,
      deletedAt: entity.deletedAt ? new DateTimeVo(entity.deletedAt) : null,
      deletedBy: entity.deletedBy,
      dueCategory: entity.dueCategory,
      isDeleted: entity.isDeleted,
      updatedAt: new DateTimeVo(entity.updatedAt),
      updatedBy: entity.updatedBy,
    });
  }

  protected getEntity(domain: Price): PriceEntity {
    return new PriceEntity({
      _id: domain._id,
      amount: domain.amount.amount,
      categories: domain.categories.map((category) => ({
        amount: category.amount.amount,
        category: category.category,
      })),
      createdAt: domain.createdAt.date,
      createdBy: domain.createdBy,
      deletedAt: domain.deletedAt?.date ?? null,
      deletedBy: domain.deletedBy,
      dueCategory: domain.dueCategory,
      isDeleted: domain.isDeleted,
      updatedAt: domain.updatedAt.date,
      updatedBy: domain.updatedBy,
    });
  }
}
