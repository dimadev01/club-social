import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveMemberRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
