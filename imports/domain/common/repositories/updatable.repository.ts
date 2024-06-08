import { Model } from '@domain/common/models/model';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';

export interface IUpdatableRepository<TDomain extends Model> {
  update(model: TDomain): Promise<void>;
  updateWithSession(model: TDomain, unitOfWork: IUnitOfWork): Promise<void>;
}
