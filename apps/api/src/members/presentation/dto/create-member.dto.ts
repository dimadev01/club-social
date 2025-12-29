import {
  CreateMemberDto,
  FileStatus,
  MaritalStatus,
  MemberAddressDto,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AddressRequestDto implements MemberAddressDto {
  @IsOptional()
  @IsString()
  public cityName: null | string;

  @IsOptional()
  @IsString()
  public stateName: null | string;

  @IsOptional()
  @IsString()
  public street: null | string;

  @IsOptional()
  @IsString()
  public zipCode: null | string;
}

export class CreateMemberRequestDto implements CreateMemberDto {
  @IsObject()
  @IsOptional()
  @Type(() => AddressRequestDto)
  @ValidateNested()
  public address: AddressRequestDto | null;

  @IsDateString()
  @IsOptional()
  public birthDate: null | string;

  @IsEnum(MemberCategory)
  @IsNotEmpty()
  public category: MemberCategory;

  @IsOptional()
  @IsString()
  public documentID: null | string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsEnum(FileStatus)
  @IsNotEmpty()
  public fileStatus: FileStatus;

  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @IsEnum(MaritalStatus)
  @IsOptional()
  public maritalStatus: MaritalStatus | null;

  @IsEnum(MemberNationality)
  @IsOptional()
  public nationality: MemberNationality | null;

  @IsArray()
  @IsString({ each: true })
  public phones: string[];

  @IsEnum(MemberSex)
  @IsOptional()
  public sex: MemberSex | null;
}
