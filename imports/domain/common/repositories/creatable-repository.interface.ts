import { Model } from '@domain/common/model';

import { IUnitOfWork } from '@domain/common/repositories/unit-of-work.interface';

export interface ICreatableRepository<TModel extends Model, TSession> {
  insertOne(model: TModel): Promise<void>;
  insertOneWithSession(
    model: TModel,
    unitOfWork: IUnitOfWork<TSession>,
  ): Promise<void>;
}
