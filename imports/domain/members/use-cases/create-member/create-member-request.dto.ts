import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';

export class CreateMemberRequestDto extends CreateUserRequestDto {
  @IsDateString()
  @IsOptional()
  dateOfBirth: string | null;

  @IsEnum(MemberCategoryEnum)
  @IsOptional()
  category: MemberCategoryEnum;

  @IsString()
  @IsOptional()
  documentID: string | null;

  @IsEnum(MemberFileStatusEnum)
  @IsOptional()
  fileStatus: MemberFileStatusEnum | null;

  @IsEnum(MemberMaritalStatusEnum)
  @IsOptional()
  maritalStatus: MemberMaritalStatusEnum | null;

  @IsEnum(MemberNationalityEnum)
  @IsOptional()
  nationality: MemberNationalityEnum | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  phones: string[] | null;

  @IsEnum(MemberSexEnum)
  @IsOptional()
  sex: MemberSexEnum | null;

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

  @IsEnum(MemberStatusEnum)
  status: MemberStatusEnum;
}
