import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { Meteor } from 'meteor/meteor';
import { err, ok, Result } from 'neverthrow';
import { Entity } from '@domain/common/entity';
import { MemberAddress } from '@domain/members/entities/member-address.entity';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { CreateMember } from '@domain/members/member.types';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Member extends Entity {
  @Type(() => MemberAddress)
  public address: MemberAddress;

  @IsEnum(MemberCategoryEnum)
  public category: MemberCategoryEnum;

  @IsDate()
  @IsOptional()
  public dateOfBirth: Date | null;

  @IsString()
  @IsOptional()
  public documentID: string | null;

  @IsEnum(MemberFileStatusEnum)
  @IsOptional()
  public fileStatus: MemberFileStatusEnum | null;

  @IsEnum(MemberMaritalStatusEnum)
  @IsOptional()
  public maritalStatus: MemberMaritalStatusEnum | null;

  @IsEnum(MemberNationalityEnum)
  @IsOptional()
  public nationality: MemberNationalityEnum | null;

  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  public phones: string[] | null;

  @IsEnum(MemberSexEnum)
  @IsOptional()
  public sex: MemberSexEnum | null;

  @IsEnum(MemberStatusEnum)
  public status: MemberStatusEnum;

  public user: Meteor.User;

  @IsString()
  public userId: string;

  public constructor() {
    super();
  }

  public get dateOfBirthString(): string | null {
    if (this.dateOfBirth) {
      return DateUtils.formatUtc(this.dateOfBirth, DateFormatEnum.DD_MM_YYYY);
    }

    return null;
  }

  public get name(): string {
    // @ts-expect-error
    return `${this.user.profile?.lastName} ${
      // @ts-expect-error
      this.user.profile?.firstName
    }`;
  }

  public static create(props: CreateMember): Result<Member, Error> {
    const member = new Member();

    member.category = props.category;

    if (props.dateOfBirth) {
      member.dateOfBirth = new Date(props.dateOfBirth);
    }

    member.user = {} as Meteor.User;

    member.status = MemberStatusEnum.Active;

    member.documentID = props.documentID;

    member.fileStatus = props.fileStatus;

    member.maritalStatus = props.maritalStatus;

    member.nationality = props.nationality;

    member.phones = props.phones;

    member.sex = props.sex;

    member.userId = props.userId;

    member.address = new MemberAddress();

    member.address.cityGovId = props.address.cityGovId;

    member.address.cityName = props.address.cityName;

    member.address.stateGovId = props.address.stateGovId;

    member.address.stateName = props.address.stateName;

    member.address.street = props.address.street;

    member.address.zipCode = props.address.zipCode;

    member.status = props.status;

    const errors = validateSync(member);

    if (errors.length > 0) {
      return err(ValidationUtils.getError(errors));
    }

    return ok(member);
  }

  public getEmail(): string | null {
    return this.user.emails?.[0].address ?? null;
  }

  public joinUser() {
    this.user = Meteor.users.findOne(this.userId) ?? ({} as Meteor.User);
  }

  public setAddress(address: MemberAddress): Result<null, Error> {
    this.address = address;

    return ok(null);
  }

  public setCategory(category: MemberCategoryEnum): Result<null, Error> {
    this.category = category;

    return ok(null);
  }

  public setDateOfBirth(dateOfBirth: Date | null): Result<null, Error> {
    this.dateOfBirth = dateOfBirth;

    return ok(null);
  }

  public setDocumentID(documentID: string | null): Result<null, Error> {
    this.documentID = documentID;

    return ok(null);
  }

  public setFileStatus(
    fileStatus: MemberFileStatusEnum | null
  ): Result<null, Error> {
    this.fileStatus = fileStatus;

    return ok(null);
  }

  public setMaritalStatus(
    maritalStatus: MemberMaritalStatusEnum | null
  ): Result<null, Error> {
    this.maritalStatus = maritalStatus;

    return ok(null);
  }

  public setNationality(
    nationality: MemberNationalityEnum | null
  ): Result<null, Error> {
    this.nationality = nationality;

    return ok(null);
  }

  public setPhones(phones: string[] | null): Result<null, Error> {
    this.phones = phones;

    return ok(null);
  }

  public setSex(sex: MemberSexEnum | null): Result<null, Error> {
    this.sex = sex;

    return ok(null);
  }

  public setStatus(status: MemberStatusEnum): Result<null, Error> {
    this.status = status;

    return ok(null);
  }
}
