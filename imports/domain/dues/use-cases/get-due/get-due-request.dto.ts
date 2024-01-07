import { IsNotEmpty, IsString } from 'class-validator';

export class GetDueRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
