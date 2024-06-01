import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';

export interface IDeletableRepository<TSession> {
  delete(request: FindOneModelByIdRequest): Promise<void>;
  deleteWithSession(
    request: FindOneModelByIdRequest,
    session: TSession,
  ): Promise<void>;
}
