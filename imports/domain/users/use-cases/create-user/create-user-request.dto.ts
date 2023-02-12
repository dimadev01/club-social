import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@domain/roles/roles.enum';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role)
  role: string;
}
