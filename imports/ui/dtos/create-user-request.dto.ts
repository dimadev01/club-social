import {
  IsEmail,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { CreateUserRequest } from '@application/users/use-cases/create-user/create-user.request';
import { RoleEnum } from '@domain/roles/role.enum';

export class CreateUserRequestDto implements CreateUserRequest {
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
  public lastName!: string;

  @IsEnum(RoleEnum)
  public role!: RoleEnum;

  public unitOfWork!: IUnitOfWork<unknown> | null;
}
