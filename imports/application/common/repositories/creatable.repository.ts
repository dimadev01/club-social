import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { Model } from '@domain/common/models/model';

export interface ICreatableRepository<TDomain extends Model> {
  insert(model: TDomain): Promise<void>;
  insertWithSession(model: TDomain, unitOfWork: IUnitOfWork): Promise<void>;
}
