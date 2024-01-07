import { IsNotEmpty, IsString } from 'class-validator';

export class GetNextMovementRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
