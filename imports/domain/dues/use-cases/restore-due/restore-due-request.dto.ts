import { IsNotEmpty, IsString } from 'class-validator';

export class RestoreDueRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
