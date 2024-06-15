import { ICreatableRepository } from './creatable.repository';
import { IQueryableRepository } from './queryable.repository';
import { IUpdatableRepository } from './updatable.repository';

import { IDeletableRepository } from '@application/common/repositories/deletable.repository';
import { Model } from '@domain/common/models/model';

export interface ICrudRepository<TDomain extends Model>
  extends ICreatableRepository<TDomain>,
    IQueryableRepository<TDomain>,
    IDeletableRepository,
    IUpdatableRepository<TDomain> {}
