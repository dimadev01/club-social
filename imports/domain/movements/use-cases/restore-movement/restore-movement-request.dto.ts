import { IsNotEmpty, IsString } from 'class-validator';

export class RestoreMovementRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
