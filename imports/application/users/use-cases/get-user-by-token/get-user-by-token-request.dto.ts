import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserByTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
