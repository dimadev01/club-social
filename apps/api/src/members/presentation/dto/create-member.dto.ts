import { CreateUserDto } from '@club-social/shared/users';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateMemberRequestDto implements CreateUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;
}
