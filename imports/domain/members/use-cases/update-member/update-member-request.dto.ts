import {
  IsArray,
  IsDateString,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateMemberRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString({ each: true })
  @IsOptional()
  @IsLowercase({ each: true })
  @IsArray()
  emails: string[] | null;

  @IsDateString()
  @IsOptional()
  dateOfBirth: string | null;
}
