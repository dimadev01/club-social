import { IsNotEmpty, IsString } from 'class-validator';

export class GetMovementRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
