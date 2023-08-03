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
import { FullEntity } from '@domain/common/full-entity.base';
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
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Member extends FullEntity {
  // #region Properties (15)

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

  @IsString()
  public userId: string;

  public user: Meteor.User;

  // #endregion Properties (15)

  // #region Constructors (1)

  public constructor() {
    super();

    this.userId = '';

    this.user = {} as Meteor.User;

    this.address = new MemberAddress();

    this.category = MemberCategory.Member;

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

  public joinUser() {
    this.user = Meteor.users.findOne(this.userId) ?? ({} as Meteor.User);
  }

  public get name(): string {
    // @ts-expect-error
    return `${this.user.profile?.lastName} ${
      // @ts-expect-error
      this.user.profile?.firstName
    }`;
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

  // #endregion Public Static Methods (1)
}
