import { DateRangeDto } from '@club-social/shared/types';
import { IsArray, IsDateString, IsOptional } from 'class-validator';

export class DateRangeRequestDto implements DateRangeDto {
  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  public dateRange?: [string, string];
}
