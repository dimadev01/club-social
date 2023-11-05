import { Entity } from '@domain/common/entity';

export interface IDeletablePort<T extends Entity> {
  delete(entity: T): Promise<void>;
}
