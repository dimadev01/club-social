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
  @IsString()
  @IsOptional()
  public addressCityGovId!: string | null;

  @IsString()
  @IsOptional()
  public addressCityName!: string | null;

  @IsString()
  @IsOptional()
  public addressStateGovId!: string | null;

  @IsString()
  @IsOptional()
  public addressStateName!: string | null;

  @IsString()
  @IsOptional()
  public addressStreet!: string | null;

  @IsString()
  @IsOptional()
  public addressZipCode!: string | null;

  @IsEnum(MemberCategoryEnum)
  @IsOptional()
  public category!: MemberCategoryEnum;

  @IsDateString()
  @IsOptional()
  public dateOfBirth!: string | null;

  @IsString()
  @IsOptional()
  public documentID!: string | null;

  @IsEnum(MemberFileStatusEnum)
  @IsOptional()
  public fileStatus!: MemberFileStatusEnum | null;

  @IsEnum(MemberMaritalStatusEnum)
  @IsOptional()
  public maritalStatus!: MemberMaritalStatusEnum | null;

  @IsEnum(MemberNationalityEnum)
  @IsOptional()
  public nationality!: MemberNationalityEnum | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public phones!: string[] | null;

  @IsEnum(MemberSexEnum)
  @IsOptional()
  public sex!: MemberSexEnum | null;

  @IsEnum(MemberStatusEnum)
  public status!: MemberStatusEnum;
}
