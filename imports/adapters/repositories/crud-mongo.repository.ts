import { Mongo } from 'meteor/mongo';
import type {
  ClientSession,
  Document,
  Filter,
  MatchKeysAndValues,
  OptionalUnlessRequiredId,
} from 'mongodb';

import { Entity } from '@adapters/common/entities/entity';
import { ClassValidationError } from '@adapters/common/errors/class-validation.error';
import { Mapper } from '@adapters/common/mappers/mapper';
import { MongoCollection } from '@adapters/mongo/collections/mongo.collection';
import { PaginatedAggregationResult } from '@adapters/mongo/common/paginated-aggregation.interface';
import { UserEntity } from '@adapters/mongo/entities/user.entity';
import { MongoUtils } from '@adapters/mongo/mongo.utils';
import { InternalServerError } from '@application/errors/internal-server.error';
import { ILogger } from '@domain/common/logger/logger.interface';
import { Model } from '@domain/common/models/model';
import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  PaginatedSorter,
} from '@domain/common/repositories/grid.repository';
import {
  FindByIdsModelRequest,
  FindOneByIdModelRequest,
} from '@domain/common/repositories/queryable.repository';

export abstract class CrudMongoRepository<
  TModel extends Model,
  TEntity extends Entity,
> implements ICrudRepository<TModel, ClientSession>
{
  public constructor(
    private readonly _collection: MongoCollection<TEntity>,
    private readonly _mapper: Mapper<TModel, TEntity>,
    private readonly _logger: ILogger,
  ) {}

  public async delete(model: TModel): Promise<void> {
    model.delete(await this._getLoggedInUserName());

    return this.update(model);
  }

  public async deleteWithSession(
    model: TModel,
    session: ClientSession,
  ): Promise<void> {
    model.delete(await this._getLoggedInUserName());

    return this.updateWithSession(model, session);
  }

  public async findByIds(request: FindByIdsModelRequest): Promise<TModel[]> {
    try {
      const entities = await this._collection
        // @ts-expect-error
        .find({ _id: { $in: request.ids } })
        .fetchAsync();

      return entities.map((entity) => this._mapper.toModel(entity));
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async findOneById(
    request: FindOneByIdModelRequest,
  ): Promise<TModel | null> {
    const entity = await this._collection.findOneAsync(request.id);

    if (!entity) {
      return null;
    }

    return this._mapper.toModel(entity);
  }

  public async findOneByIdOrThrow(
    request: FindOneByIdModelRequest,
  ): Promise<TModel> {
    const model = await this.findOneById(request);

    if (!model) {
      throw new InternalServerError(`Entity with id ${request.id} not found`);
    }

    return model;
  }

  public async findOneByIdOrThrowWithSession(
    id: string,
    session: ClientSession,
  ): Promise<TModel> {
    try {
      const entity = await this._collection
        .rawCollection()
        .findOne({ _id: id } as Filter<TEntity>, { session });

      if (!entity) {
        throw new InternalServerError(`Entity with id ${id} not found`);
      }

      return this._mapper.toModel(entity as TEntity);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async findPaginated(
    request: FindPaginatedRequest,
  ): Promise<FindPaginatedResponse<TModel>> {
    // @ts-expect-error
    const query: Mongo.Selector<TEntity> = {
      isDeleted: false,
    };

    const totalCount = await this._collection.find(query).countAsync();

    const options: Mongo.Options<TEntity> = {
      sort: this.getMongoSorter(request.sorter),
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      limit: request.limit,
      skip: (request.page - 1) * request.limit,
    };

    const entities = await this._collection.find(query, options).fetchAsync();

    const items = entities.map((entity) => this._mapper.toModel(entity));

    return { items, totalCount };
  }

  protected async findPaginatedPipeline(
    pipeline: Document[],
    entitiesPipeline: Document[],
  ): Promise<FindPaginatedResponse<TModel>> {
    pipeline.push(
      {
        $facet: {
          entities: entitiesPipeline,
          totalCount: [{ $count: 'count' }],
        },
      },
      {
        $project: {
          entities: 1,
          totalCount: MongoUtils.first('$totalCount.count', 0),
        },
      },
    );

    const [{ entities, totalCount }] = await this._collection
      .rawCollection()
      .aggregate<PaginatedAggregationResult<TEntity>>(pipeline)
      .toArray();

    return {
      items: entities.map((entity) => this._mapper.toModel(entity)),
      totalCount,
    };
  }

  public async insert(model: TModel): Promise<void> {
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
    model: TModel,
    session: ClientSession,
  ): Promise<void> {
    try {
      const entity = (await this._mapper.toEntity(
        model,
      )) as unknown as OptionalUnlessRequiredId<TEntity>;

      entity.createdBy = await this._getLoggedInUserName();

      entity.updatedBy = entity.createdBy;

      await this._collection.rawCollection().insertOne(entity, {
        session,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async update(model: TModel): Promise<void> {
    try {
      model.update(await this._getLoggedInUserName());

      const entity = await this._mapper.toEntity(model);

      await this._collection.updateAsync(entity._id, { $set: entity });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async updateWithSession(
    model: TModel,
    session: ClientSession,
  ): Promise<void> {
    try {
      model.update(await this._getLoggedInUserName());

      const entity = await this._mapper.toEntity(model);

      await this._collection
        .rawCollection()
        .updateOne(
          { _id: model._id } as Filter<TEntity>,
          { $set: entity as unknown as MatchKeysAndValues<TEntity> },
          { session },
        );
    } catch (error) {
      this.handleError(error);
    }
  }

  protected getPaginatedSorterStage(sorter: PaginatedSorter): Document {
    return { $sort: this.getMongoSorter(sorter) };
  }

  protected getPaginatedPipeline(request: FindPaginatedRequest): Document[] {
    return [
      this.getPaginatedSorterStage(request.sorter),
      ...this.getPaginatedStages(request.page, request.limit),
    ];
  }

  protected getPaginatedStages(page: number, limit: number): Document[] {
    return [{ $skip: (page - 1) * limit }, { $limit: limit }];
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
}
