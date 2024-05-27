import { EntityOld } from '@domain/common/entity.old';

export interface IDeletablePort<T extends EntityOld> {
  delete(entity: T): Promise<void>;
}
