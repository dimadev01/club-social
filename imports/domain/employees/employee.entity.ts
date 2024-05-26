import { IsDate, IsString, validateSync } from 'class-validator';
import { Meteor } from 'meteor/meteor';

import { Entity } from '@domain/common/entity';
import { ClassValidationUtils } from '@shared/utils/validation.utils';

export class Employee extends Entity {
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

  public static create(userId: string): Employee {
    const professor = new Employee();

    professor.userId = userId;

    const errors = validateSync(professor);

    if (errors.length > 0) {
      throw new Error(ClassValidationUtils.getErrorMessage(errors));
    }

    return professor;
  }
}
