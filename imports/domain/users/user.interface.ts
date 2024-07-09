import { IModel } from '@domain/common/models/model.interface';
import { RoleEnum } from '@domain/roles/role.enum';
import { UserStateEnum, UserThemeEnum } from '@domain/users/user.enum';

export interface IUserModel extends IModel {
  emails: IUserEmail[];
  firstName: string;
  heartbeat: Date | null;
  isActive: boolean;
  lastName: string;
  role: RoleEnum;
  services: Record<string, unknown>;
  state: UserStateEnum;
  theme: UserThemeEnum;
}

export interface CreateUser {
  emails: string[] | null;
  firstName: string;
  lastName: string;
  role: RoleEnum;
}

export interface IUserEmail {
  address: string;
  verified: boolean;
}

export interface CreateUserEmail {
  address: string;
  verified: boolean;
}
