import { Model } from '@domain/common/models/model';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';

export interface CreateModelResponse {
  id: string;
}

export interface ICreatableRepository<TDomain extends Model> {
  insert(model: TDomain): Promise<void>;
  insertWithSession(model: TDomain, unitOfWork: IUnitOfWork): Promise<void>;
}
