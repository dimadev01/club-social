import { IsEnum } from 'class-validator';

import { UserThemeEnum } from '@domain/users/user.enum';

export class UpdateUserThemeRequestDto {
  @IsEnum(UserThemeEnum)
  public theme: UserThemeEnum;
}
