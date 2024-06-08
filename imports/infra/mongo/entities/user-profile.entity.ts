import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { RoleEnum } from '@domain/roles/role.enum';
import { UserStateEnum, UserThemeEnum } from '@domain/users/user.enum';

export class UserProfileEntity {
  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @IsEnum(RoleEnum)
  public role: RoleEnum;

  @IsEnum(UserStateEnum)
  public state: UserStateEnum;

  @IsEnum(UserThemeEnum)
  public theme: UserThemeEnum;

  public constructor(props: UserProfileEntity) {
    this.firstName = props.firstName;

    this.lastName = props.lastName;

    this.role = props.role;

    this.theme = props.theme;

    this.state = props.state;
  }
}
