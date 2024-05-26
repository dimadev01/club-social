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
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString({ each: true })
  @IsLowercase({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  @IsArray()
  emails: string[] | null;

  @IsEnum(RoleEnum)
  role: RoleEnum;
}
