import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { RoleEnum } from '@domain/roles/role.enum';

export interface CreateUserRequest {
  emails: string[] | null;
  firstName: string;
  lastName: string;
  role: RoleEnum;
  unitOfWork: IUnitOfWork | null;
}
