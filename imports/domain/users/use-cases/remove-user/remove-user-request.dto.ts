import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveUserRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
