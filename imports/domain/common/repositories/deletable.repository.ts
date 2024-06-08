import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';

export interface IDeletableRepository {
  delete(request: FindOneById): Promise<void>;
  deleteWithSession(
    request: FindOneById,
    unitOfWork: IUnitOfWork,
  ): Promise<void>;
}
