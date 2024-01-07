import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteDueRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
