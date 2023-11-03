import { SortOrder } from 'antd/es/table/interface';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { MongoOptions } from '@application/use-cases/use-case.interface';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { MeteorErrorCodeEnum } from '@infra/meteor/common/meteor-errors.enum';
import { ValidationUtils } from '@shared/utils/validation.utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class UseCase<T extends object = any> {
  /**
   * @deprecated Use validateDto from MeteorMethod instead
   */
  protected async validateDto(
    classType: ClassType<T>,
    value: T
  ): Promise<void> {
    if (!value) {
      throw new Meteor.Error(
        MeteorErrorCodeEnum.BadRequest,
        'Request is empty'
      );
    }

    try {
      await transformAndValidate(classType, value);
    } catch (err) {
      const errors = err as ValidationError[];

      throw new Meteor.Error(
        MeteorErrorCodeEnum.BadRequest,
        ValidationUtils.getErrorMessage(errors)
      );
    }
  }

  protected validatePermission(scope: Scope, permission: Permission): void {
    let user: Meteor.User | null;

    try {
      user = Meteor.user();
    } catch (error) {
      return;
    }

    if (!user) {
      throw new Meteor.Error(
        MeteorErrorCodeEnum.Unauthorized,
        'You are not logged in'
      );
    }

    if (!Roles.userIsInRole(user, permission, scope)) {
      throw new Meteor.Error(
        MeteorErrorCodeEnum.Forbidden,
        'You are not allowed to perform this action'
      );
    }
  }

  protected getSorterValue(sorter: SortOrder, defaultSortOrder = 1): number {
    if (sorter === 'ascend') {
      return 1;
    }

    if (sorter === 'descend') {
      return -1;
    }

    return defaultSortOrder;
  }

  protected createQueryOptions(page: number, pageSize: number): MongoOptions {
    return {
      limit: pageSize,
      skip: (page - 1) * pageSize,
      sort: {},
    };
  }

  protected getPaginatedPipeline({
    $sort,
    page,
    pageSize,
  }: {
    $sort: object;
    page: number;
    pageSize: number;
  }) {
    return [{ $sort }, { $skip: (page - 1) * pageSize }, { $limit: pageSize }];
  }
}
