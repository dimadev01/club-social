import { IsEnum, IsLowercase, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@domain/roles/roles.enum';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString({ each: true })
  @IsLowercase({ each: true })
  emails: string[];

  @IsEnum(Role)
  role: string;
}
