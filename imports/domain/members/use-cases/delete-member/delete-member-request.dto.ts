import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMemberRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
