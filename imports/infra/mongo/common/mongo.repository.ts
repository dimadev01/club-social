import { instanceToPlain } from 'class-transformer';
import { validate } from 'class-validator';
import { ILogger } from '@application/logger/logger.interface';
import { IRepository } from '@application/repositories/repository.interface';
import { MongoOptions } from '@application/use-cases/use-case.interface';
import { FullEntity } from '@domain/common/full-entity.base';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export abstract class MongoRepository<T extends FullEntity>
  implements IRepository<T>
{
  private readonly _collection: MongoCollection<T>;

  public constructor(protected readonly _logger: ILogger) {
    this._collection = this.getCollection();
  }

  public async create(entity: Mongo.OptionalId<T>): Promise<string> {
    try {
      await validate(entity);

      entity.create(this._getCurrentUserName());

      return await this._collection.insertAsync(entity);
    } catch (error) {
      this._logger.error(error);

      throw error;
    }
  }

  public async delete(entity: T): Promise<void> {
    try {
      entity.delete(this._getCurrentUserName());

      await validate(entity);

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

  public async update(entity: T): Promise<void> {
    try {
      entity.update(this._getCurrentUserName());

      await validate(entity);

      await this._collection.updateAsync(entity._id, {
        $set: instanceToPlain<T>(entity) as object,
      });
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

  private _getCurrentUserName(): string {
    try {
      const currentUser = Meteor.user();

      return `${currentUser?.profile?.firstName} ${currentUser?.profile?.lastName}`;
    } catch (error) {
      return 'System';
    }
  }
}
