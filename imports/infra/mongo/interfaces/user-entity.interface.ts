import { RoleEnum } from '@domain/roles/role.enum';
import { UserStateEnum, UserThemeEnum } from '@domain/users/user.enum';
import { IEntity } from '@infra/mongo/entities/common/entity.interface';

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
