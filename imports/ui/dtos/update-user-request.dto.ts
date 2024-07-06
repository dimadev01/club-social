import {
  IsEmail,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { UpdateUserRequest } from '@application/users/use-cases/update-user/update-user.request';
import { RoleEnum } from '@domain/roles/role.enum';

export class UpdateUserRequestDto implements UpdateUserRequest {
  @IsEmail()
  @IsLowercase()
  @IsString()
  public email!: string;

  public emails!: string[] | null;

  @IsNotEmpty()
  @IsString()
  public firstName!: string;

  @IsNotEmpty()
  @IsString()
  public id!: string;

  @IsNotEmpty()
  @IsString()
  public lastName!: string;

  @IsEnum(RoleEnum)
  public role!: RoleEnum;

  public unitOfWork!: IUnitOfWork<unknown> | null;
}
