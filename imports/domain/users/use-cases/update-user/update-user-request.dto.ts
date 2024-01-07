import {
  IsArray,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsArray()
  @IsString({ each: true })
  @IsLowercase({ each: true })
  @IsOptional()
  @IsNotEmpty({ each: true })
  emails: string[] | null;
}
