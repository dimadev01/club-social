import { instanceToPlain } from 'class-transformer';
import { ILogger } from '@application/logger/logger.interface';
import { IRepository } from '@application/repositories/repository.base';
import { FullEntity } from '@domain/common/full-entity.base';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export abstract class MongoRepository<T extends FullEntity>
  implements IRepository<T>
{
  // #region Constructors (1)

  private readonly _collection: MongoCollection<T>;

  public constructor() {
    this._collection = this.getCollection();
  }

  // #endregion Constructors (1)

  // #region Public Methods (5)

  public async create(entity: Mongo.OptionalId<T>): Promise<string> {
    try {
      entity.create(this._getCurrentUserName());

      return await this._collection.insertAsync(entity);
    } catch (error) {
      this.getLogger().error(error);

      throw error;
    }
  }

  public async delete(entity: T): Promise<void> {
    try {
      entity.delete(this._getCurrentUserName());

      return await this.update(entity);
    } catch (error) {
      this.getLogger().error(error);

      throw error;
    }
  }

  public findOneById(id: string): Promise<T | undefined> {
    try {
      return this._collection.findOneAsync(id);
    } catch (error) {
      this.getLogger().error(error);

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
      this.getLogger().error(error);

      throw error;
    }
  }

  public async update(entity: T): Promise<void> {
    try {
      entity.update(this._getCurrentUserName());

      await this._collection.updateAsync(entity._id, {
        $set: instanceToPlain<T>(entity) as object,
      });
    } catch (error) {
      this.getLogger().error(error);

      throw error;
    }
  }

  // #endregion Public Methods (5)

  // #region Public Abstract Methods (2)

  public abstract getCollection(): MongoCollection<T>;
  public abstract getLogger(): ILogger;

  // #endregion Public Abstract Methods (2)

  // #region Private Methods (1)

  private _getCurrentUserName(): string {
    try {
      const currentUser = Meteor.user();

      return `${currentUser?.profile?.firstName} ${currentUser?.profile?.lastName}`;
    } catch (error) {
      return 'System';
    }
  }

  // #endregion Private Methods (1)
}
