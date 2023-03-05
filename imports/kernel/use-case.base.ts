import { SortOrder } from 'antd/es/table/interface';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { MeteorErrorCode } from '@kernel/errors.enum';
import { MongoOptions } from '@kernel/use-case.interface';
import { ValidationUtils } from '@shared/utils/validation.utils';

export abstract class UseCase<T extends object> {
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
