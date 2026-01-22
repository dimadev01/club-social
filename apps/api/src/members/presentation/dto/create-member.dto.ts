import {
  CreateMemberDto,
  FileStatus,
  MaritalStatus,
  MemberAddressDto,
  MemberCategory,
  MemberNationality,
  MemberNotificationPreferencesDto,
  MemberSex,
} from '@club-social/shared/members';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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

export class NotificationPreferencesRequestDto implements MemberNotificationPreferencesDto {
  @IsBoolean()
  public notifyOnDueCreated: boolean;

  @IsBoolean()
  public notifyOnPaymentCreated: boolean;
}

export class CreateMemberRequestDto implements CreateMemberDto {
  @IsObject()
  @IsOptional()
  @Type(() => AddressRequestDto)
  @ValidateNested()
  public address: AddressRequestDto | null;

  @IsDateString()
  public birthDate: string;

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

  @IsObject()
  @Type(() => NotificationPreferencesRequestDto)
  @ValidateNested()
  public notificationPreferences: NotificationPreferencesRequestDto;

  @IsArray()
  @IsString({ each: true })
  public phones: string[];

  @IsEnum(MemberSex)
  public sex: MemberSex;
}
