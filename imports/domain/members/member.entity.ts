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
import { MemberAddress } from '@domain/members/member-address.entity';
import {
  MemberCategory,
  MemberFileStatus,
  MemberMaritalStatus,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@domain/members/members.enum';
import { CreateMember } from '@domain/members/members.types';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Member extends Entity {
  @Type(() => MemberAddress)
  public address: MemberAddress;

  @IsEnum(MemberCategory)
  public category: MemberCategory;

  @IsDate()
  @IsOptional()
  public dateOfBirth: Date | null;

  @IsString()
  @IsOptional()
  public documentID: string | null;

  @IsEnum(MemberFileStatus)
  @IsOptional()
  public fileStatus: MemberFileStatus | null;

  @IsEnum(MemberMaritalStatus)
  @IsOptional()
  public maritalStatus: MemberMaritalStatus | null;

  @IsEnum(MemberNationality)
  @IsOptional()
  public nationality: MemberNationality | null;

  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  public phones: string[] | null;

  @IsEnum(MemberSex)
  @IsOptional()
  public sex: MemberSex | null;

  @IsEnum(MemberStatus)
  public status: MemberStatus;

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

    member.userId = '';

    member.user = {} as Meteor.User;

    member.address = new MemberAddress();

    member.category = MemberCategory.Member;

    member.dateOfBirth = null;

    member.documentID = null;

    member.fileStatus = null;

    member.maritalStatus = null;

    member.nationality = null;

    member.phones = null;

    member.sex = null;

    member.status = MemberStatus.Active;

    member.documentID = props.documentID;

    member.fileStatus = props.fileStatus;

    member.maritalStatus = props.maritalStatus;

    member.nationality = props.nationality;

    member.phones = props.phones;

    member.sex = props.sex;

    member.userId = props.userId;

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

  public getEmail(): string {
    return this.user.emails?.[0].address ?? '';
  }

  public joinUser() {
    this.user = Meteor.users.findOne(this.userId) ?? ({} as Meteor.User);
  }
}
