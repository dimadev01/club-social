import { instanceToPlain } from 'class-transformer';
import { validate } from 'class-validator';
import { Mongo } from 'meteor/mongo';
import type {
  ClientSession,
  Filter,
  MatchKeysAndValues,
  OptionalUnlessRequiredId,
} from 'mongodb';
import SimpleSchema from 'simpl-schema';
import invariant from 'tiny-invariant';

import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedRequest } from '@application/pagination/find-paginated.request';
import { ICrudPort } from '@application/ports/crud.port';
import { MongoOptions } from '@application/use-cases/use-case.interface';
import { EntityOld } from '@domain/common/entity.old';
import { MongoCollection } from '@infra/mongo/collections/mongo.collection';
import { ClassValidationUtils } from '@shared/utils/validation.utils';

export abstract class MongoCrudRepositoryOld<T extends EntityOld>
  implements ICrudPort<T>
{
  private readonly _collection: MongoCollection<T>;

  public constructor(protected readonly _logger: ILogger) {
    this._collection = this.getCollection();
  }

  public async create(entity: Mongo.OptionalId<T>): Promise<string> {
    try {
      entity.create(await this._getLoggedInUserName());

      this.getSchema().validate(
        this.getSchema().clean(
          entity as Record<string | number | symbol, unknown>,
        ),
      );

      const errors = await validate(entity);

      if (errors.length > 0) {
        throw ClassValidationUtils.getError(errors);
      }

      return await this._collection.insertAsync(entity);
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  public async createWithSession(
    entity: OptionalUnlessRequiredId<T>,
    session: ClientSession,
  ): Promise<string> {
    try {
      entity.create(await this._getLoggedInUserName());

      this.getSchema().validate(
        this.getSchema().clean(
          entity as Record<string | number | symbol, unknown>,
        ),
      );

      const result = await this._collection
        .rawCollection()
        .insertOne(entity, { session });

      return result.insertedId;
    } catch (error) {
      this._logger.info('createWithSession');

      this._logger.error(error);

      throw error;
    }
  }

  public async delete(entity: T): Promise<void> {
    try {
      entity.delete(await this._getLoggedInUserName());

      return await this.update(entity);
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  public async findByIds(ids: string[]): Promise<T[]> {
    try {
      // @ts-expect-error
      const query: Mongo.Selector<T> = {
        _id: { $in: ids },
      };

      return await this._collection.find(query).fetchAsync();
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  public findOneById(id: string): Promise<T | undefined> {
    try {
      return this._collection.findOneAsync(id);
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  public async findOneByIdOrThrow(id: string): Promise<T> {
    try {
      const entity = await this.findOneById(id);

      if (!entity) {
        throw new Error(`Entity with id ${id} not found`);
      }

      return entity;
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  public async findOneByIdOrThrowWithSession(
    id: string,
    session: ClientSession,
  ): Promise<T> {
    try {
      const entity = await this._collection
        .rawCollection()
        .findOne({ _id: id } as Filter<T>, { session });

      if (!entity) {
        throw new Error(`Entity with id ${id} not found`);
      }

      return entity as T;
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  public async removeById(id: string): Promise<void> {
    try {
      // @ts-ignore
      await this._collection.removeAsync({ _id: id });
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  public async update(entity: T): Promise<void> {
    try {
      entity.update(await this._getLoggedInUserName());

      await this._collection.updateAsync(entity._id, {
        $set: instanceToPlain<T>(entity) as object,
      });
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  public async updateWithSession(
    entity: T,
    session: ClientSession,
  ): Promise<void> {
    try {
      entity.update(await this._getLoggedInUserName());

      this.getSchema().validate(
        this.getSchema().clean(
          entity as Record<string | number | symbol, unknown>,
        ),
      );

      await this._collection
        .rawCollection()
        .updateOne(
          { _id: entity._id } as Filter<T>,
          { $set: instanceToPlain<T>(entity) as MatchKeysAndValues<T> },
          { session },
        );
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  protected _getSorterValue(
    sorter: 'descend' | 'ascend' | null,
    defaultSortOrder = 1,
  ): number {
    if (sorter === 'ascend') {
      return 1;
    }

    if (sorter === 'descend') {
      return -1;
    }

    return defaultSortOrder;
  }

  protected createPaginatedQueryOptionsNew(
    request: FindPaginatedRequest,
  ): MongoOptions {
    return {
      limit: request.pageSize,
      skip: (request.page - 1) * request.pageSize,
      sort: {
        [request.sortField]: this._getSorterValue(request.sortOrder),
      },
    };
  }

  protected createSearchMatch(field: string, search: string) {
    return { [field]: { $options: 'i', $regex: search.trim() } };
  }

  protected async getAggregationCount(
    condition: boolean,
    count: number,
  ): Promise<number> {
    if (condition) {
      return count;
    }

    return this.getCollection().rawCollection().estimatedDocumentCount();
  }

  protected async getCurrentUserOrThrow(): Promise<Meteor.User> {
    const currentUser = await Meteor.userAsync();

    invariant(currentUser);

    return currentUser;
  }

  protected getPaginatedPipelineQuery(request: FindPaginatedRequest) {
    return [
      {
        $sort: {
          [request.sortField]: this._getSorterValue(request.sortOrder),
        },
      },
      { $skip: (request.page - 1) * request.pageSize },
      { $limit: request.pageSize },
    ];
  }

  protected getPaginatedQuery(page: number, pageSize: number): MongoOptions {
    return { limit: pageSize, skip: (page - 1) * pageSize, sort: {} };
  }

  protected abstract getCollection(): MongoCollection<T>;
  protected abstract getSchema(): SimpleSchema;

  private async _getLoggedInUserName(): Promise<string> {
    try {
      const currentUser = await this.getCurrentUserOrThrow();

      return `${currentUser.profile?.firstName} ${currentUser.profile?.lastName}`;
    } catch (error) {
      return 'System';
    }
  }
}
