import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MinLength,
} from 'class-validator';

export class MemberSearchRequestDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Max(50)
  @Type(() => Number)
  public limit?: number = 20;

  @IsString()
  @MinLength(2, { message: 'Search term must be at least 2 characters' })
  @Transform(({ value }) => value?.trim())
  public q: string;
}
