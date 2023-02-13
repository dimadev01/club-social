import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveUserRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
