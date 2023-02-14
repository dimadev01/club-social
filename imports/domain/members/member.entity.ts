import {
  IsDateString,
  IsNotEmpty,
  IsString,
  validateSync,
} from 'class-validator';
import { err, ok, Result } from 'neverthrow';
import { Entity } from '@domain/members/entity.base';
import { CreateMember } from '@domain/members/members.types';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Member extends Entity {
  // #region Properties (2)

  @IsDateString()
  public dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  public userId: string;

  // #endregion Properties (2)

  // #region Constructors (1)

  public constructor() {
    super();
  }

  // #endregion Constructors (1)

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

  public updateDateOfBirth(dateOfBirth: string): void {
    this.dateOfBirth = new Date(dateOfBirth);
  }

  // #endregion Public Methods (1)
}
