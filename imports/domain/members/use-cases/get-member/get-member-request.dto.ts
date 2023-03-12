import { IsNotEmpty, IsString } from 'class-validator';

export class GetMemberRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
