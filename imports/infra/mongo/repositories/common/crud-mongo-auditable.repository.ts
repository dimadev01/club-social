import { Random } from 'meteor/random';
import { err } from 'neverthrow';

import { ILoggerService } from '@application/common/logger/logger.interface';
import { Model } from '@domain/common/models/model';
import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { AuditableEntity } from '@infra/mongo/common/entities/auditable.entity';
import { Entity } from '@infra/mongo/common/entities/entity';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';
import { MongoUnitOfWork } from '@infra/mongo/repositories/common/mongo.unit-of-work';

export abstract class CrudMongoAuditableRepository<
  TDomain extends Model,
  TEntity extends Entity,
  TAuditableEntity extends AuditableEntity<TEntity>,
> extends CrudMongoRepository<TDomain, TEntity> {
  public constructor(
    protected readonly collection: MongoCollection<TEntity>,
    protected readonly mapper: Mapper<TDomain, TEntity>,
    protected readonly logger: ILoggerService,
    protected readonly auditableCollection: MongoCollection<TAuditableEntity>,
  ) {
    super(collection, mapper, logger);
  }

  public async update(model: TDomain): Promise<void> {
    await super.update(model);

    await this._save(model);
  }

  public async updateWithSession(
    model: TDomain,
    unitOfWork: MongoUnitOfWork,
  ): Promise<void> {
    await super.updateWithSession(model, unitOfWork);

    await this._save(model);
  }

  public async insert(model: TDomain): Promise<void> {
    await super.insert(model);

    await this._save(model);
  }

  public async insertWithSession(
    model: TDomain,
    unitOfWork: MongoUnitOfWork,
  ): Promise<void> {
    await super.insertWithSession(model, unitOfWork);

    await this._save(model);
  }

  private async _save(model: TDomain): Promise<void> {
    try {
      const entity = await this.mapper.toEntity(model);

      const auditableEntity: AuditableEntity<TEntity> = {
        ...entity,
        _id: Random.id(),
        parentId: entity._id,
      };

      // @ts-expect-error
      await this.auditableCollection.insertAsync(auditableEntity);
    } catch (error) {
      super.handleError(err);
    }
  }
}
