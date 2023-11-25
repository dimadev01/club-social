import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateMovementRequestDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsDateString()
  date: string;

  @IsInt()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  notes: string | null;

  @IsOptional()
  @IsString()
  memberId: string | null;

  @IsOptional()
  @IsString()
  professorId: string | null;

  @IsOptional()
  @IsString()
  serviceId: string | null;

  @IsOptional()
  @IsString()
  employeeId: string | null;
}
