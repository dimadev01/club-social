import {
  IsDateString,
  IsLowercase,
  IsNotEmpty,
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

  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  email: string;

  @IsDateString()
  dateOfBirth: string;
}
