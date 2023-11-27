import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateMovementRequestDto {
  @IsInt()
  @IsPositive()
  public amount: number;

  @IsDateString()
  public date: string;

  @IsString()
  @IsOptional()
  public employeeId: string | null;

  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsString()
  @IsOptional()
  public memberId: string | null;

  @IsString()
  @IsOptional()
  public notes: string | null;

  @IsString()
  @IsOptional()
  public professorId: string | null;

  @IsString()
  @IsOptional()
  public serviceId: string | null;
}
