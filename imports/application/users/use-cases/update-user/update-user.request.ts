import { CreateUserRequest } from '@application/users/use-cases/create-user/create-user.request';
import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';

export interface UpdateUserRequest<TSession>
  extends CreateUserRequest<TSession>,
    FindOneModelByIdRequest {}
