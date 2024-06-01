import { SortOrder } from 'antd/es/table/interface';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

import { MongoOptionsOld } from '@application/use-cases/use-case.interface';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { MeteorErrorCodeEnum } from '@infra/meteor/common/meteor-errors.enum';
import { ClassValidationUtils } from '@shared/utils/validation.utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class UseCaseOld<T extends object = any> {
  /**
   * @deprecated Use validateDto from MeteorMethod instead
   */
  protected async validateDto(
    classType: ClassType<T>,
    value: T,
  ): Promise<void> {
    if (!value) {
      throw new Meteor.Error(
        MeteorErrorCodeEnum.BAD_REQUEST,
        'Request is empty',
      );
    }

    try {
      await transformAndValidate(classType, value);
    } catch (err) {
      const errors = err as ValidationError[];

      throw new Meteor.Error(
        MeteorErrorCodeEnum.BAD_REQUEST,
        ClassValidationUtils.getErrorMessage(errors),
      );
    }
  }

  protected async validatePermission(
    scope: ScopeEnum,
    permission: PermissionEnum,
  ): Promise<void> {
    let user: Meteor.User | null;

    try {
      user = await Meteor.userAsync();
    } catch (error) {
      return;
    }

    if (!user) {
      throw new Meteor.Error(
        MeteorErrorCodeEnum.UNAUTHORIZED,
        'You are not logged in',
      );
    }

    if (!Roles.userIsInRole(user, permission, scope)) {
      throw new Meteor.Error(
        MeteorErrorCodeEnum.FORBIDDEN,
        'You are not allowed to perform this action',
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

  protected createQueryOptions(
    page: number,
    pageSize: number,
  ): MongoOptionsOld {
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
