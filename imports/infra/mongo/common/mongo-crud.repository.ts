import { instanceToPlain } from 'class-transformer';
import type { ClientSession, Filter, OptionalUnlessRequiredId } from 'mongodb';
import { ILogger } from '@application/logger/logger.interface';
import { ICrudPort } from '@application/repositories/crud.port';
import { MongoOptions } from '@application/use-cases/use-case.interface';
import { Entity } from '@domain/common/entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export abstract class MongoCrudRepository<T extends Entity>
  implements ICrudPort<T>
{
  private readonly _collection: MongoCollection<T>;

  public constructor(protected readonly _logger: ILogger) {
    this._collection = this.getCollection();
  }

  public async create(entity: Mongo.OptionalId<T>): Promise<string> {
    try {
      entity.create(this._getLoggedInUserName());

      return await this._collection.insertAsync(entity);
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  public async createWithSession(
    entity: OptionalUnlessRequiredId<T>,
    session: ClientSession
  ): Promise<string> {
    try {
      const result = await this._collection
        .rawCollection()
        .insertOne(entity, { session });

      return result.insertedId;
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  public async delete(entity: T): Promise<void> {
    try {
      entity.delete(this._getLoggedInUserName());

      return await this.update(entity);
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
    session: ClientSession
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
      entity.update(this._getLoggedInUserName());

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
    session: ClientSession
  ): Promise<void> {
    try {
      await this._collection.rawCollection().updateOne(entity, { session });
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  protected createPaginatedQueryOptions(
    page: number,
    pageSize: number
  ): MongoOptions {
    return {
      limit: pageSize,
      skip: (page - 1) * pageSize,
      sort: {},
    };
  }

  protected getSorterValue(
    sorter: 'descend' | 'ascend' | null,
    defaultSortOrder = 1
  ): number {
    if (sorter === 'ascend') {
      return 1;
    }

    if (sorter === 'descend') {
      return -1;
    }

    return defaultSortOrder;
  }

  protected abstract getCollection(): MongoCollection<T>;

  private _getLoggedInUserName(): string {
    try {
      const currentUser = Meteor.user();

      return `${currentUser?.profile?.firstName} ${currentUser?.profile?.lastName}`;
    } catch (error) {
      return 'System';
    }
  }
}
