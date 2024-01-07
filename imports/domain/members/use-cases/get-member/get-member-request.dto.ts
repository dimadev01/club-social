import { IsNotEmpty, IsString } from 'class-validator';

export class GetMemberRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
