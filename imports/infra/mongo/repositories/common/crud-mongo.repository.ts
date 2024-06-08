import { Mongo } from 'meteor/mongo';
import type {
  ClientSession,
  Document,
  Filter,
  MatchKeysAndValues,
  OptionalUnlessRequiredId,
} from 'mongodb';

import { ClassValidationError } from '@adapters/common/errors/class-validation.error';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { ILogger } from '@domain/common/logger/logger.interface';
import { Model } from '@domain/common/models/model';
import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  PaginatedSorter,
} from '@domain/common/repositories/grid.repository';
import {
  FindManyByIds,
  FindOneById,
} from '@domain/common/repositories/queryable.repository';
import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { Entity } from '@infra/mongo/common/entities/entity';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { UserEntity } from '@infra/mongo/entities/user.entity';
import { MongoUnitOfWork } from '@infra/mongo/repositories/common/mongo.unit-of-work';

export abstract class CrudMongoRepository<
  TDomain extends Model,
  TEntity extends Entity,
> implements ICrudRepository<TDomain>
{
  public constructor(
    private readonly _collection: MongoCollection<TEntity>,
    private readonly _mapper: Mapper<TDomain, TEntity>,
    private readonly _logger: ILogger,
  ) {}

  public async delete(request: FindOneById): Promise<void> {
    const model = await this.findOneByIdOrThrow(request);

    model.delete(await this._getLoggedInUserName());

    return this.update(model);
  }

  public async deleteWithSession(
    request: FindOneById,
    unitOfWork: MongoUnitOfWork,
  ): Promise<void> {
    const model = await this.findOneByIdOrThrow(request);

    model.delete(await this._getLoggedInUserName());

    return this.updateWithSession(model, unitOfWork);
  }

  public async findByIds(request: FindManyByIds): Promise<TDomain[]> {
    try {
      const entities = await this._collection
        // @ts-expect-error
        .find({ _id: { $in: request.ids } })
        .fetchAsync();

      return entities.map((entity) => this._mapper.toDomain(entity));
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async findOneById(request: FindOneById): Promise<TDomain | null> {
    // @ts-expect-error
    const entity = await this._collection.findOneAsync({
      _id: request.id,
      isDeleted: false,
    });

    if (!entity) {
      return null;
    }

    return this._mapper.toDomain(entity);
  }

  public async findOneByIdOrThrow(request: FindOneById): Promise<TDomain> {
    const model = await this.findOneById(request);

    if (!model) {
      throw new InternalServerError(`Entity with id ${request.id} not found`);
    }

    return model;
  }

  public async findOneByIdOrThrowWithSession(
    id: string,
    session: ClientSession,
  ): Promise<TDomain> {
    try {
      const entity = await this._collection
        .rawCollection()
        .findOne({ _id: id, isDeleted: false } as Filter<TEntity>, { session });

      if (!entity) {
        throw new InternalServerError(`Entity with id ${id} not found`);
      }

      return this._mapper.toDomain(entity as TEntity);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async insert(model: TDomain): Promise<void> {
    try {
      const entity = await this._mapper.toEntity(model);

      entity.createdBy = await this._getLoggedInUserName();

      entity.updatedBy = entity.createdBy;

      // @ts-expect-error
      await this._collection.insertAsync(entity);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async insertWithSession(
    model: TDomain,
    unitOfWork: MongoUnitOfWork,
  ): Promise<void> {
    try {
      const entity = (await this._mapper.toEntity(
        model,
      )) as unknown as OptionalUnlessRequiredId<TEntity>;

      entity.createdBy = await this._getLoggedInUserName();

      entity.updatedBy = entity.createdBy;

      await this._collection.rawCollection().insertOne(entity, {
        session: unitOfWork.value,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async update(model: TDomain): Promise<void> {
    try {
      model.update(await this._getLoggedInUserName());

      const entity = await this._mapper.toEntity(model);

      await this._collection.updateAsync(entity._id, { $set: entity });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async updateWithSession(
    model: TDomain,
    unitOfWork: MongoUnitOfWork,
  ): Promise<void> {
    try {
      model.update(await this._getLoggedInUserName());

      const entity = await this._mapper.toEntity(model);

      await this._collection
        .rawCollection()
        .updateOne(
          { _id: model._id } as Filter<TEntity>,
          { $set: entity as unknown as MatchKeysAndValues<TEntity> },
          { session: unitOfWork.value },
        );
    } catch (error) {
      this.handleError(error);
    }
  }

  protected async aggregate<T extends Document>(
    pipeline: Document[],
  ): Promise<T[]> {
    return this._collection.rawCollection().aggregate<T>(pipeline).toArray();
  }

  protected async count(query: Mongo.Query<TEntity>): Promise<number> {
    return this._collection.rawCollection().countDocuments(query);
  }

  protected getMemberLookupPipeline(): Document[] {
    return [
      {
        $lookup: {
          as: 'member',
          foreignField: '_id',
          from: 'members',
          localField: 'memberId',
          pipeline: [...this.getUserLookupPipeline()],
        },
      },
      {
        $unwind: '$member',
      },
    ];
  }

  protected getMongoSorter(paginatedSorter: PaginatedSorter): {
    [key: string]: number;
  } {
    const sorter: { [key: string]: 1 | -1 } = {};

    Object.entries(paginatedSorter).forEach(([key, value]) => {
      if (value === 'ascend') {
        sorter[key] = 1;
      } else if (value === 'descend') {
        sorter[key] = -1;
      } else if (value === null) {
        sorter[key] = -1;
      }
    });

    return sorter;
  }

  protected getPaginatedPipeline(request: FindPaginatedRequest): Document[] {
    return [
      this.getPaginatedSorterStage(request.sorter),
      ...this.getPaginatedStages(request.page, request.limit),
    ];
  }

  protected getPaginatedSorterStage(sorter: PaginatedSorter): Document {
    return { $sort: this.getMongoSorter(sorter) };
  }

  protected getUserLookupPipeline(): Document[] {
    return [
      {
        $lookup: {
          as: 'user',
          foreignField: '_id',
          from: 'users',
          localField: 'userId',
        },
      },
      { $unwind: '$user' },
    ];
  }

  protected handleError(error: unknown): never {
    if (error instanceof ClassValidationError) {
      this._logger.error(error, { errors: error.errors });

      throw error;
    }

    if (error instanceof Error) {
      this._logger.error(error);

      throw error;
    }

    const internalServerError = new InternalServerError();

    this._logger.error(internalServerError, { error });

    throw internalServerError;
  }

  protected async paginate(
    pipeline: Document[],
    query: Mongo.Query<TEntity>,
  ): Promise<FindPaginatedResponse<TDomain>> {
    const [entities, totalCount] = await Promise.all([
      this.aggregate<TEntity>(pipeline),
      this.count(query),
    ]);

    return {
      items: entities.map((entity) => this._mapper.toDomain(entity)),
      totalCount,
    };
  }

  private async _getLoggedInUserName(): Promise<string> {
    try {
      const user = (await Meteor.userAsync()) as unknown as UserEntity | null;

      if (!user) {
        return 'System';
      }

      return `${user.profile.firstName} ${user.profile.lastName}`;
    } catch (error) {
      return 'System';
    }
  }

  private getPaginatedStages(page: number, limit: number): Document[] {
    return [{ $skip: (page - 1) * limit }, { $limit: limit }];
  }
}
