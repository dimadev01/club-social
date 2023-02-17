import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsLowercase,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { Meteor } from 'meteor/meteor';
import { err, ok, Result } from 'neverthrow';
import { Entity } from '@domain/members/entity.base';
import { MemberAddress } from '@domain/members/member-address.entity';
import {
  MemberCategory,
  MemberMaritalStatus,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@domain/members/members.enum';
import { CreateMember } from '@domain/members/members.types';
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Member extends Entity {
  // #region Properties (13)

  @IsOptional()
  @Type(() => MemberAddress)
  public address: MemberAddress | null;

  @IsEnum(MemberCategory)
  @IsOptional()
  public category: MemberCategory | null;

  @IsDate()
  @IsOptional()
  public dateOfBirth: Date | null;

  @IsString()
  @IsOptional()
  public documentID: string | null;

  @IsString({ each: true })
  @IsLowercase({ each: true })
  @IsOptional()
  @IsArray()
  public emails: string[] | null;

  @IsString()
  @IsOptional()
  public fileStatus: string | null;

  @IsEnum(MemberMaritalStatus)
  @IsOptional()
  public maritalStatus: string | null;

  @IsEnum(MemberNationality)
  @IsOptional()
  public nationality: MemberNationality | null;

  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  public phones: string[] | null;

  @IsEnum(MemberSex)
  @IsOptional()
  public sex: MemberSex | null;

  @IsEnum(MemberStatus)
  public status: string;

  public user: Meteor.User | null;

  @IsString()
  @IsOptional()
  public userId: string | null;

  // #endregion Properties (13)

  // #region Constructors (1)

  public constructor() {
    super();

    this.address = null;

    this.category = null;

    this.dateOfBirth = null;

    this.documentID = null;

    this.emails = null;

    this.fileStatus = null;

    this.maritalStatus = null;

    this.nationality = null;

    this.phones = null;

    this.sex = null;

    this.status = MemberStatus.Active;
  }

  // #endregion Constructors (1)

  // #region Public Accessors (1)

  public get dateOfBirthString(): string | null {
    if (this.dateOfBirth) {
      return DateUtils.formatUtc(this.dateOfBirth, DateFormats.DD_MM_YYYY);
    }

    return null;
  }

  // #endregion Public Accessors (1)

  // #region Public Static Methods (1)

  public static create(props: CreateMember): Result<Member, Error> {
    const member = new Member();

    if (props.dateOfBirth) {
      member.dateOfBirth = new Date(props.dateOfBirth);
    }

    member.userId = props.userId;

    const errors = validateSync(member);

    if (errors.length > 0) {
      return err(ValidationUtils.getError(errors));
    }

    return ok(member);
  }

  // #endregion Public Static Methods (1)

  // #region Public Methods (1)

  public updateDateOfBirth(value: string | Date): void {
    if (typeof value === 'string') {
      this.dateOfBirth = new Date(value);
    } else {
      this.dateOfBirth = value;
    }
  }

  // #endregion Public Methods (1)
}
