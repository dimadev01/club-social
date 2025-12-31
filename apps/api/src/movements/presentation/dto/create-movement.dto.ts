import {
  CreateMovementDto,
  MovementCategory,
  MovementType,
} from '@club-social/shared/movements';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMovementRequestDto implements CreateMovementDto {
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  public amount: number;

  @IsEnum(MovementCategory)
  @IsNotEmpty()
  public category: MovementCategory;

  @IsDateString()
  @IsNotEmpty()
  public date: string;

  @IsOptional()
  @IsString()
  public notes: null | string;

  @IsEnum(MovementType)
  @IsNotEmpty()
  public type: MovementType;
}
