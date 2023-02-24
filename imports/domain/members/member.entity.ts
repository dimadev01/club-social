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
import { FullEntity } from '@kernel/full-entity.base';
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Member extends FullEntity {
  // #region Properties (15)

  @Type(() => MemberAddress)
  public address: MemberAddress;

  @IsEnum(MemberCategory)
  @IsOptional()
  public category: MemberCategory | null;

  @IsDate()
  @IsOptional()
  public dateOfBirth: Date | null;

  @IsString()
  @IsOptional()
  public documentID: string | null;

  @IsArray()
  @IsOptional()
  public emails: Meteor.UserEmail[] | null;

  @IsEnum(MemberFileStatus)
  @IsOptional()
  public fileStatus: MemberFileStatus | null;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

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

  // #endregion Properties (15)

  // #region Constructors (1)

  public constructor() {
    super();

    this.emails = [];

    this.firstName = '';

    this.lastName = '';

    this.userId = '';

    this.user = {} as Meteor.User;

    this.address = new MemberAddress();

    this.category = null;

    this.dateOfBirth = null;

    this.documentID = null;

    this.fileStatus = null;

    this.maritalStatus = null;

    this.nationality = null;

    this.phones = null;

    this.sex = null;

    this.status = MemberStatus.Active;
  }

  // #endregion Constructors (1)

  // #region Public Accessors (2)

  public get dateOfBirthString(): string | null {
    if (this.dateOfBirth) {
      return DateUtils.formatUtc(this.dateOfBirth, DateFormats.DD_MM_YYYY);
    }

    return null;
  }

  public get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // #endregion Public Accessors (2)

  // #region Public Static Methods (1)

  public static create(props: CreateMember): Result<Member, Error> {
    const member = new Member();

    member.category = props.category;

    if (props.dateOfBirth) {
      member.dateOfBirth = new Date(props.dateOfBirth);
    }

    member.documentID = props.documentID;

    member.fileStatus = props.fileStatus;

    member.maritalStatus = props.maritalStatus;

    member.nationality = props.nationality;

    member.phones = props.phones;

    member.sex = props.sex;

    member.firstName = props.firstName;

    member.lastName = props.lastName;

    member.emails =
      props.emails?.map((email) => ({ address: email, verified: false })) ??
      null;

    member.userId = props.userId;

    member.address.cityGovId = props.address.cityGovId;

    member.address.cityName = props.address.cityName;

    member.address.stateGovId = props.address.stateGovId;

    member.address.stateName = props.address.stateName;

    member.address.street = props.address.street;

    member.address.zipCode = props.address.zipCode;

    const errors = validateSync(member);

    if (errors.length > 0) {
      return err(ValidationUtils.getError(errors));
    }

    return ok(member);
  }

  // #endregion Public Static Methods (1)
}
