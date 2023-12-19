import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMovementRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
