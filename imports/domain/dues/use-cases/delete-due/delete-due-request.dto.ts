import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteDueRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
