import { IsDate, IsString, validateSync } from 'class-validator';
import { Meteor } from 'meteor/meteor';
import { FullEntity } from '@domain/common/full-entity.base';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Professor extends FullEntity {
  // #region Properties (6)

  @IsDate()
  public createdAt: Date;

  @IsString()
  public createdBy: string;

  @IsDate()
  public updatedAt: Date;

  @IsString()
  public updatedBy: string;

  public user: Meteor.User;

  @IsString()
  public userId: string;

  // #endregion Properties (6)

  // #region Constructors (1)

  public constructor() {
    super();

    this.createdAt = new Date();

    this.createdBy = 'System';

    this.updatedAt = this.createdAt;

    this.updatedBy = 'System';
  }

  // #endregion Constructors (1)

  // #region Public Accessors (1)

  public get name(): string {
    // @ts-expect-error
    return `${this.user.profile?.lastName} ${
      // @ts-expect-error
      this.user.profile?.firstName
    }`;
  }

  // #endregion Public Accessors (1)

  // #region Public Static Methods (1)

  public static create(userId: string): Professor {
    const professor = new Professor();

    professor.userId = userId;

    const errors = validateSync(professor);

    if (errors.length > 0) {
      throw new Error(ValidationUtils.getErrorMessage(errors));
    }

    return professor;
  }

  // #endregion Public Static Methods (1)
}
