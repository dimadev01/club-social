import { IsOptional, IsString } from 'class-validator';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';

export class UpdateMovementRequestDto extends CreateMovementRequestDto {
  @IsString()
  @IsOptional()
  id: string;
}
