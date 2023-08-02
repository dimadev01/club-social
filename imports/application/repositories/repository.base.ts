import { FullEntity } from '@domain/common/full-entity.base';

export interface IRepository<T extends FullEntity> {
  create(entity: Mongo.OptionalId<T>): Promise<string>;
  delete(entity: T): Promise<void>;
  findOneById(id: string): Promise<T | undefined>;
  findOneByIdOrThrow(id: string): Promise<T>;
  update(entity: T): Promise<void>;
}
