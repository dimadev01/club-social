import {
  IsArray,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { RoleEnum } from '@domain/roles/role.enum';

export class CreateUserRequestDto {
  @IsString({ each: true })
  @IsLowercase({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  @IsArray()
  public emails: string[] | null;

  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @IsEnum(RoleEnum)
  public role: RoleEnum;
}
