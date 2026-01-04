import {
  Language,
  Theme,
  ThemeVariant,
  UpdateUserPreferencesDto,
  UserPreferencesDto,
} from '@club-social/shared/users';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserPreferencesRequestDto implements UpdateUserPreferencesDto {
  @IsEnum(Language)
  @IsOptional()
  public language?: Language;

  @IsEnum(Theme)
  @IsOptional()
  public theme?: Theme;

  @IsEnum(ThemeVariant)
  @IsOptional()
  public themeVariant?: ThemeVariant;

  @IsOptional()
  @IsString()
  public timezone?: string;
}

export class UserPreferencesResponseDto implements UserPreferencesDto {
  public language: Language;
  public theme: Theme;
  public themeVariant: ThemeVariant;
  public timezone: string;
}
