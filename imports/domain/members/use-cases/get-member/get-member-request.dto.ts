import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
