import {
  IsArray,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoleEnum } from '@domain/roles/roles.enum';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
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
