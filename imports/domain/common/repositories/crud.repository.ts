import { ICreatableRepository } from './creatable.repository';
import { IQueryableRepository } from './queryable.repository';
import { IUpdatableRepository } from './updatable.repository';

import { Model } from '@domain/common/models/model';
import { IDeletableRepository } from '@domain/common/repositories/deletable.repository';

export interface ICrudRepository<TDomain extends Model>
  extends ICreatableRepository<TDomain>,
    IQueryableRepository<TDomain>,
    IDeletableRepository,
    IUpdatableRepository<TDomain> {}
