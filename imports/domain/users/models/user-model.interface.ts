import { IModelProps } from '@domain/common/models/model.interface';
import { RoleEnum } from '@domain/roles/role.enum';
import { UserStateEnum, UserThemeEnum } from '@domain/users/user.enum';

export interface IUserModel extends IModelProps {
  emails: IUserEmailModel[] | null;
  firstName: string;
  heartbeat: Date | null;
  lastName: string;
  role: RoleEnum;
  services: Record<string, unknown>;
  state: UserStateEnum;
  theme: UserThemeEnum;
}

export interface IUserEmailModel {
  address: string;
  verified: boolean;
}

export interface CreateUser {
  emails: CreateUserEmail[] | null;
  firstName: string;
  lastName: string;
  role: RoleEnum;
}

export interface CreateUserEmail {
  address: string;
  verified: boolean;
}
