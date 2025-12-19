import { IUpdateUserDto, UserStatus } from '@club-social/shared/users';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRequestDto implements IUpdateUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @IsEnum(UserStatus)
  public status: UserStatus;
}
