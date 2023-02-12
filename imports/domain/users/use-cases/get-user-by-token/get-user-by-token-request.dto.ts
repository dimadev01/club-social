import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserByTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
