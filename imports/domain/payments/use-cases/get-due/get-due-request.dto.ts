import { IsNotEmpty, IsString } from 'class-validator';

export class GetDueRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
