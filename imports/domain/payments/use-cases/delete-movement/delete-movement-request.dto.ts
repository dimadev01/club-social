import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMovementRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
