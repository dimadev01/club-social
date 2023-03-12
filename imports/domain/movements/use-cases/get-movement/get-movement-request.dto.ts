import { IsNotEmpty, IsString } from 'class-validator';

export class GetMovementRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
