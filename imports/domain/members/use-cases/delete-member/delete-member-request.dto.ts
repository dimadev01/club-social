import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMemberRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
