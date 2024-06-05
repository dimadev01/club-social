import { CreateUserRequest } from '@application/users/use-cases/create-user/create-user.request';
import { FindOneById } from '@domain/common/repositories/queryable.repository';

export interface UpdateUserRequest extends CreateUserRequest, FindOneById {}
