import { Entity } from '@domain/common/entity';

export interface ICreatablePort<T extends Entity> {
  create(entity: Mongo.OptionalId<T>): Promise<string>;
}
