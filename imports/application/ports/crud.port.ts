import { ICreatablePort } from '@application/ports/creatable.port';
import { IDeletablePort } from '@application/ports/deletable.port';
import { IQueryablePort } from '@application/ports/queryable.port';
import { IRemovablePort } from '@application/ports/removable.port';
import { IUpdatablePort } from '@application/ports/updatable.port';
import { EntityOld } from '@domain/common/entity.old';

export interface ICrudPort<T extends EntityOld>
  extends ICreatablePort<T>,
    IRemovablePort,
    IDeletablePort<T>,
    IQueryablePort<T>,
    IUpdatablePort<T> {}
