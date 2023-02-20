import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  MemberCategory,
  MemberFileStatus,
  MemberMaritalStatus,
  MemberNationality,
  MemberSex,
} from '@domain/members/members.enum';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';

export class CreateMemberRequestDto extends CreateUserRequestDto {
  @IsDateString()
  @IsOptional()
  dateOfBirth: string | null;

  @IsEnum(MemberCategory)
  @IsOptional()
  category: MemberCategory | null;

  @IsString()
  @IsOptional()
  documentID: string | null;

  @IsEnum(MemberFileStatus)
  @IsOptional()
  fileStatus: MemberFileStatus | null;

  @IsEnum(MemberMaritalStatus)
  @IsOptional()
  maritalStatus: MemberMaritalStatus | null;

  @IsEnum(MemberNationality)
  @IsOptional()
  nationality: MemberNationality | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  phones: string[] | null;

  @IsEnum(MemberSex)
  @IsOptional()
  sex: MemberSex | null;

  @IsString()
  @IsOptional()
  addressStateGovId: string | null;

  @IsString()
  @IsOptional()
  addressStateName: string | null;

  @IsString()
  @IsOptional()
  addressCityGovId: string | null;

  @IsString()
  @IsOptional()
  addressCityName: string | null;

  @IsString()
  @IsOptional()
  addressStreet: string | null;

  @IsString()
  @IsOptional()
  addressZipCode: string | null;
}
