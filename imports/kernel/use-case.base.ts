import { SortOrder } from 'antd/es/table/interface';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { MeteorErrorCode } from '@kernel/errors.enum';
import { MongoOptions } from '@kernel/use-case.interface';
import { ValidationUtils } from '@shared/utils/validation.utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class UseCase<T extends object = any> {
  protected async validateDto(
    classType: ClassType<T>,
    value: T
  ): Promise<void> {
    if (!value) {
      throw new Meteor.Error(MeteorErrorCode.BadRequest, 'Request is empty');
    }

    try {
      await transformAndValidate(classType, value);
    } catch (err) {
      const errors = err as ValidationError[];

      throw new Meteor.Error(
        MeteorErrorCode.BadRequest,
        ValidationUtils.getErrorMessage(errors)
      );
    }
  }

  protected validatePermission(scope: Scope, permission: Permission): void {
    let user: Meteor.User | null;

    let bypass = false;

    try {
      user = Meteor.user();
    } catch (error) {
      user = null;

      bypass = true;
    }

    if (bypass) {
      return;
    }

    if (!user) {
      throw new Meteor.Error(
        MeteorErrorCode.Unauthorized,
        'You are not logged in'
      );
    }

    if (!Roles.userIsInRole(user, permission, scope)) {
      throw new Meteor.Error(
        MeteorErrorCode.Forbidden,
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
