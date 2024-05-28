import {
  IsArray,
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
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
import { UpdateMemberRequest } from '@domain/members/use-cases/update-member-new/update-member.request';
import { CreateMemberRequestDto } from '@infra/controllers/types/create-member-request.dto';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class UpdateMemberRequestDto
  extends CreateMemberRequestDto
  implements UpdateMemberRequest
{
  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public addressCityGovId!: string | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public addressCityName!: string | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public addressStateGovId!: string | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public addressStateName!: string | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public addressStreet!: string | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public addressZipCode!: string | null;

  @IsEnum(MemberCategoryEnum)
  public category!: MemberCategoryEnum;

  @IsDateString()
  @IsNullable()
  @IsDefined()
  public dateOfBirth!: string | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public documentID!: string | null;

  @IsEmail({}, { each: true })
  @IsLowercase({ each: true })
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsArray()
  @IsNullable()
  @IsDefined()
  public emails!: string[] | null;

  @IsNullable()
  @IsDefined()
  public fileStatus!: MemberFileStatusEnum | null;

  @IsNotEmpty()
  @IsString()
  public firstName!: string;

  @IsNotEmpty()
  @IsString()
  public id!: string;

  @IsNotEmpty()
  @IsString()
  public lastName!: string;

  @IsEnum(MemberMaritalStatusEnum)
  @IsNullable()
  @IsDefined()
  public maritalStatus!: MemberMaritalStatusEnum | null;

  @IsEnum(MemberNationalityEnum)
  @IsNullable()
  @IsDefined()
  public nationality!: MemberNationalityEnum | null;

  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsArray()
  @IsNullable()
  @IsDefined()
  public phones!: string[] | null;

  @IsEnum(MemberSexEnum)
  @IsNullable()
  @IsDefined()
  public sex!: MemberSexEnum | null;

  @IsEnum(MemberStatusEnum)
  public status!: MemberStatusEnum;
}
