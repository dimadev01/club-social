import { CreateDueDto, DueCategory } from '@club-social/shared/dues';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDueRequestDto implements CreateDueDto {
  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsEnum(DueCategory)
  @IsNotEmpty()
  public category: DueCategory;

  @IsDateString()
  @IsNotEmpty()
  public date: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public memberId: string;

  @IsOptional()
  @IsString()
  public notes: null | string;
}
