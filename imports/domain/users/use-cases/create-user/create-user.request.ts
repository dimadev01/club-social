import { IUnitOfWork } from '@domain/common/repositories/unit-of-work.interface';
import { RoleEnum } from '@domain/roles/role.enum';

export interface CreateUserRequest<TSession> {
  emails: string[] | null;
  firstName: string;
  lastName: string;
  role: RoleEnum;
  unitOfWork: IUnitOfWork<TSession> | null;
}
