import {
  IsArray,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsOptional()
  @IsNotEmpty({ each: true })
  emails: string[] | null;
}
