import { FindOneById } from '@application/common/repositories/queryable.repository';
import { CreateUserRequest } from '@application/users/use-cases/create-user/create-user.request';

export interface UpdateUserRequest extends CreateUserRequest, FindOneById {}
