import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, validateSync } from 'class-validator';
import { Meteor } from 'meteor/meteor';
import { err, ok, Result } from 'neverthrow';
import { Entity } from '@domain/members/entity.base';
import { MemberAddress } from '@domain/members/member-address.entity';
import { CreateMember } from '@domain/members/members.types';
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Member extends Entity {
  // #region Properties (13)

  @IsOptional()
  @Type(() => MemberAddress)
  public address: MemberAddress | null;

  @IsString()
  @IsOptional()
  public category: string | null;

  @IsDate()
  @IsOptional()
  public dateOfBirth: Date | null;

  @IsString()
  @IsOptional()
  public documentID: string | null;

  @IsString({ each: true })
  @IsOptional()
  public emails: string[] | null;

  @IsString()
  @IsOptional()
  public fileStatus: string | null;

  @IsString()
  @IsOptional()
  public maritalStatus: string | null;

  @IsString()
  @IsOptional()
  public nationality: string | null;

  @IsString({ each: true })
  @IsOptional()
  public phones: string[] | null;

  @IsString()
  @IsOptional()
  public sex: string | null;

  @IsString()
  @IsOptional()
  public status: string | null;

  public user: Meteor.User | null;

  @IsString()
  @IsOptional()
  public userId: string | null;

  // #endregion Properties (13)

  // #region Constructors (1)

  public constructor() {
    super();
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

    member.dateOfBirth = new Date(props.dateOfBirth);

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
