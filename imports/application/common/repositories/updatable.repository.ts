import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { Model } from '@domain/common/models/model';

export interface IUpdatableRepository<TDomain extends Model> {
  update(model: TDomain): Promise<void>;
  updateWithSession(model: TDomain, unitOfWork: IUnitOfWork): Promise<void>;
}
