import {
  Theme,
  ThemeAlgorithm,
  UpdateUserPreferencesDto,
  UserPreferencesDto,
} from '@club-social/shared/users';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserPreferencesRequestDto implements UpdateUserPreferencesDto {
  @IsEnum(Theme)
  @IsOptional()
  public theme?: Theme;

  @IsEnum(ThemeAlgorithm)
  @IsOptional()
  public themeAlgorithm?: ThemeAlgorithm;
}

export class UserPreferencesResponseDto implements UserPreferencesDto {
  public theme: Theme;
  public themeAlgorithm: ThemeAlgorithm;
}
