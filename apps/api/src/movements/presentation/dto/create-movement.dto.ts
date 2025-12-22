import {
  ICreateMovementDto,
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

export class CreateMovementRequestDto implements ICreateMovementDto {
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
  public description: null | string;

  @IsEnum(MovementType)
  @IsNotEmpty()
  public type: MovementType;
}
