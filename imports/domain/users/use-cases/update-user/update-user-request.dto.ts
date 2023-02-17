import { IsArray, IsLowercase, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsArray()
  @IsString({ each: true })
  @IsLowercase({ each: true })
  emails: string[];
}
