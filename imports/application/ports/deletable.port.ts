import { Entity } from '@domain/common/entity.old';

export interface IDeletablePort<T extends Entity> {
  delete(entity: T): Promise<void>;
}
