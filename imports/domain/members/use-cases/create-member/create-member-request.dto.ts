import { IsEnum, IsLowercase, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@domain/roles/roles.enum';

export class CreateMemberRequestDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  email: string;

  @IsEnum(Role)
  role: string;
}
