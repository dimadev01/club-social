import { FindOneModelById } from '@domain/common/repositories/queryable.repository';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';

export interface IDeletableRepository {
  delete(request: FindOneModelById): Promise<void>;
  deleteWithSession(
    request: FindOneModelById,
    unitOfWork: IUnitOfWork,
  ): Promise<void>;
}
