import { CreateUserRequest } from '@domain/users/use-cases/create-user/create-user.request';

export interface UpdateUserRequest<TSession>
  extends CreateUserRequest<TSession> {
  id: string;
}
