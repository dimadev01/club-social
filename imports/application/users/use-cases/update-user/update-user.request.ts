import { CreateUserRequest } from '@application/users/use-cases/create-user/create-user.request';
import { FindOneModelById } from '@domain/common/repositories/queryable.repository';

export interface UpdateUserRequest
  extends CreateUserRequest,
    FindOneModelById {}
