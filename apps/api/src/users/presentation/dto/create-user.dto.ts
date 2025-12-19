import { ICreateUserDto } from '@club-social/shared/users';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequestDto implements ICreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;
}
