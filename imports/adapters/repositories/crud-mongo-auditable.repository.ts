import { Random } from 'meteor/random';
import type { ClientSession } from 'mongodb';
import { err } from 'neverthrow';

import { AuditableEntity } from '@adapters/common/entities/auditable.entity';
import { Entity } from '@adapters/common/entities/entity';
import { Mapper } from '@adapters/common/mappers/mapper';
import { MongoCollection } from '@adapters/mongo/collections/mongo.collection';
import { CrudMongoRepository } from '@adapters/repositories/crud-mongo.repository';
import { ILogger } from '@application/logger/logger.interface';
import { Model } from '@domain/common/models/model';

export abstract class CrudMongoAuditableRepository<
  TModel extends Model,
  TEntity extends Entity,
  TAuditableEntity extends AuditableEntity<TEntity>,
> extends CrudMongoRepository<TModel, TEntity> {
  public constructor(
    protected readonly collection: MongoCollection<TEntity>,
    protected readonly mapper: Mapper<TModel, TEntity>,
    protected readonly logger: ILogger,
    protected readonly auditableCollection: MongoCollection<TAuditableEntity>,
  ) {
    super(collection, mapper, logger);
  }

  public async update(model: TModel): Promise<void> {
    await super.update(model);

    await this._save(model);
  }

  public async updateWithSession(
    model: TModel,
    session: ClientSession,
  ): Promise<void> {
    await super.updateWithSession(model, session);

    await this._save(model);
  }

  public async insert(model: TModel): Promise<void> {
    await super.insert(model);

    await this._save(model);
  }

  public async insertWithSession(
    model: TModel,
    session: ClientSession,
  ): Promise<void> {
    await super.insertWithSession(model, session);

    await this._save(model);
  }

  private async _save(model: TModel): Promise<void> {
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
