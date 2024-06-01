import { IEntity } from '@adapters/common/entities/entity.interface';
import { RoleEnum } from '@domain/roles/role.enum';
import { UserStateEnum, UserThemeEnum } from '@domain/users/user.enum';

export interface IUserEntity extends IEntity {
  emails: IUserEmailEntity[] | null;
  heartbeat: Date | null;
  profile: IUserProfileEntity;
  services: Record<string, unknown>;
}

export interface IUserEmailEntity {
  address: string;
  verified: boolean;
}

export interface IUserProfileEntity {
  firstName: string;
  lastName: string;
  role: RoleEnum;
  state: UserStateEnum;
  theme: UserThemeEnum;
}
