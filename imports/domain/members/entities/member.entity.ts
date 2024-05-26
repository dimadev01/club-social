import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
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

export class Member extends Entity {
  @ValidateNested()
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
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
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
      return DateUtils.formatUtc(this.dateOfBirth, DateFormatEnum.DDMMYYYY);
    }

    return null;
  }

  public get firstName(): string {
    return this.user.profile?.firstName ?? '';
  }

  public get lastName(): string {
    return this.user.profile?.lastName ?? '';
  }

  public get name(): string {
    return `${this.lastName} ${this.firstName}`;
  }

  public static create(props: CreateMember): Result<Member, Error> {
    const member = new Member();

    member.userId = props.userId;

    const updateResult: Result<null[], Error> = Result.combine([
      member.setDateOfBirth(
        props.dateOfBirth ? new Date(props.dateOfBirth) : null,
      ),
      member.setCategory(props.category),
      member.setStatus(props.status),
      member.setDocumentID(props.documentID),
      member.setFileStatus(props.fileStatus),
      member.setMaritalStatus(props.maritalStatus),
      member.setNationality(props.nationality),
      member.setPhones(props.phones),
      member.setSex(props.sex),
      member.setAddress({
        cityGovId: props.address.cityGovId,
        cityName: props.address.cityName,
        stateGovId: props.address.stateGovId,
        stateName: props.address.stateName,
        street: props.address.street,
        zipCode: props.address.zipCode,
      }),
    ]);

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    return ok(member);
  }

  public getEmail(): string | null {
    return this.user.emails?.[0]?.address ?? null;
  }

  public setAddress(address: MemberAddress): Result<null, Error> {
    this.address = address;

    return ok(null);
  }

  public setCategory(category: MemberCategoryEnum): Result<null, Error> {
    this.category = category;

    return ok(null);
  }

  public setDateOfBirth(
    dateOfBirth: Date | null | string,
  ): Result<null, Error> {
    if (typeof dateOfBirth === 'string') {
      this.dateOfBirth = new Date(dateOfBirth);
    } else if (dateOfBirth instanceof Date) {
      this.dateOfBirth = dateOfBirth;
    } else {
      this.dateOfBirth = null;
    }

    return ok(null);
  }

  public setDocumentID(documentID: string | null): Result<null, Error> {
    this.documentID = documentID;

    return ok(null);
  }

  public setFileStatus(
    fileStatus: MemberFileStatusEnum | null,
  ): Result<null, Error> {
    this.fileStatus = fileStatus;

    return ok(null);
  }

  public setMaritalStatus(
    maritalStatus: MemberMaritalStatusEnum | null,
  ): Result<null, Error> {
    this.maritalStatus = maritalStatus;

    return ok(null);
  }

  public setNationality(
    nationality: MemberNationalityEnum | null,
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
