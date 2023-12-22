import { IsNotEmpty, IsString } from 'class-validator';

export class RestoreMovementRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
