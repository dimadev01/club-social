import { Mongo } from 'meteor/mongo';
import type {
  ClientSession,
  Filter,
  MatchKeysAndValues,
  OptionalUnlessRequiredId,
} from 'mongodb';

import { InternalServerError } from '@application/errors/internal-server.error';
import { ILogger } from '@application/logger/logger.interface';
import { Model } from '@domain/common/models/model';
import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  PaginatedSorter,
} from '@domain/common/repositories/queryable-grid-repository.interface';
import { Mapper } from '@infra/mappers/mapper';
import { MongoCollection } from '@infra/mongo/collections/mongo.collection';
import { Entity } from '@infra/mongo/entities/common/entity';
import { UserEntity } from '@infra/mongo/entities/users/user.entity';
import { ClassValidationError } from '@infra/mongo/errors/class-validation.error';

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

  public async findByIds(ids: string[]): Promise<TModel[]> {
    try {
      const entities = await this._collection
        // @ts-expect-error
        .find({ _id: { $in: ids } })
        .fetchAsync();

      return entities.map((entity) => this._mapper.toModel(entity));
    } catch (error) {
      return this._handleError(error);
    }
  }

  public async findOneById(id: string): Promise<TModel | null> {
    const entity = await this._collection.findOneAsync(id);

    if (!entity) {
      return null;
    }

    return this._mapper.toModel(entity);
  }

  public async findOneByIdOrThrow(id: string): Promise<TModel> {
    const model = await this.findOneById(id);

    if (!model) {
      throw new InternalServerError(`Entity with id ${id} not found`);
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
      return this._handleError(error);
    }
  }

  public async findPaginated(
    request: FindPaginatedRequest<TModel>,
  ): Promise<FindPaginatedResponse<TModel>> {
    // @ts-expect-error
    const query: Mongo.Selector<TEntity> = {
      isDeleted: false,
    };

    const totalCount = await this._collection.find(query).countAsync();

    const options: Mongo.Options<TEntity> = {
      limit: request.limit,
      skip: request.page,
      sort: this.getSorter(request.sorter),
    };

    const entities = await this._collection.find(query, options).fetchAsync();

    const items = entities.map((entity) => this._mapper.toModel(entity));

    return { items, totalCount };
  }

  public async insert(model: TModel): Promise<void> {
    try {
      const entity = (await this._mapper.toEntity(
        model,
      )) as unknown as Mongo.OptionalId<TEntity>;

      entity.createdBy = await this._getLoggedInUserName();

      entity.updatedBy = entity.createdBy;

      await this._collection.insertAsync(entity);
    } catch (error) {
      this._handleError(error);
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

      await this._collection.rawCollection().insertOne(entity, {
        session,
      });
    } catch (error) {
      this._handleError(error);
    }
  }

  public async update(model: TModel): Promise<void> {
    try {
      model.update(await this._getLoggedInUserName());

      const entity = await this._mapper.toEntity(model);

      await this._collection.updateAsync(entity._id, { $set: entity });
    } catch (error) {
      this._handleError(error);
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
      this._handleError(error);
    }
  }

  protected getSorter(paginatedSorter: PaginatedSorter): {
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

    console.log(sorter);

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

  private _handleError(error: unknown): never {
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
