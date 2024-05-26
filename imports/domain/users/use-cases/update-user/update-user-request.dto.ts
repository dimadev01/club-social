import {
  IsArray,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { UserStateEnum } from '@domain/users/user.enum';

export class UpdateUserRequestDto {
  @IsArray()
  @IsString({ each: true })
  @IsLowercase({ each: true })
  @IsOptional()
  @IsNotEmpty({ each: true })
  public emails: string[] | null;

  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @IsEnum(UserStateEnum)
  public state: UserStateEnum;
}
