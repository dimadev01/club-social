import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';

export interface IDeletableRepository {
  delete(request: FindOneModelByIdRequest): Promise<void>;
  deleteWithSession(
    request: FindOneModelByIdRequest,
    unitOfWork: IUnitOfWork,
  ): Promise<void>;
}
