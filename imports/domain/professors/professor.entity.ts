import { IsDate, IsString, validateSync } from 'class-validator';
import { Meteor } from 'meteor/meteor';

import { EntityOld } from '@domain/common/entity.old';
import { ClassValidationUtils } from '@shared/utils/validation.utils';

export class Professor extends EntityOld {
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

  public constructor() {
    super();

    this.createdAt = new Date();

    this.createdBy = 'System';

    this.updatedAt = this.createdAt;

    this.updatedBy = 'System';
  }

  public get name(): string {
    return `${this.user.profile?.lastName} ${this.user.profile?.firstName}`;
  }

  public static create(userId: string): Professor {
    const professor = new Professor();

    professor.userId = userId;

    const errors = validateSync(professor);

    if (errors.length > 0) {
      throw new Error(ClassValidationUtils.getErrorMessage(errors));
    }

    return professor;
  }
}
