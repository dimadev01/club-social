import { UpdateUserDto } from '@club-social/types/users';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRequestDto implements UpdateUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;
}
