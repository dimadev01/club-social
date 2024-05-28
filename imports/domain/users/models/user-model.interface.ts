import { IModel } from '@domain/common/models/model.interface';
import { RoleEnum } from '@domain/roles/role.enum';
import {
  CreateUserEmail,
  IUserEmailModel,
} from '@domain/users/models/user-email-model.interface';
import { UserStateEnum, UserThemeEnum } from '@domain/users/user.enum';

export interface IUserModel extends IModel {
  emails: IUserEmailModel[] | null;
  firstName: string;
  heartbeat: Date | null;
  lastName: string;
  role: RoleEnum;
  services: Record<string, unknown>;
  state: UserStateEnum;
  theme: UserThemeEnum;
}

export interface CreateUser {
  emails: CreateUserEmail[] | null;
  firstName: string;
  lastName: string;
  role: RoleEnum;
}
