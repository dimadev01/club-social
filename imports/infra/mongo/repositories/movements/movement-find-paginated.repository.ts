import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import {
  CategoryEnum,
  CategoryTypeEnum,
} from '@domain/categories/category.enum';
import { Movement } from '@domain/movements/entities/movement.entity';
import {
  MovementCollection,
  MovementSchema,
} from '@domain/movements/movement.collection';
import { IMovementPaginatedPort } from '@domain/movements/movement.port';
import { DIToken } from '@infra/di/di-tokens';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';
import {
  FindPaginatedMovementsAggregationResult,
  FindPaginatedMovementsRequest,
  FindPaginatedMovementsResponse,
} from '@infra/mongo/repositories/movements/movement-repository.types';
import { DateUtils } from '@shared/utils/date.utils';
import { MongoUtils } from '@shared/utils/mongo.utils';

@injectable()
export class MovementFindPaginatedRepository
  extends MongoCrudRepository<Movement>
  implements IMovementPaginatedPort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger,
  ) {
    super(_logger);
  }

  public async findPaginated(
    request: FindPaginatedMovementsRequest,
  ): Promise<FindPaginatedMovementsResponse> {
    const query: Mongo.Query<Movement> = {
      isDeleted: request.showDeleted ?? false,
    };

    if (request.from && request.to) {
      query.date = {
        $gte: DateUtils.utc(request.from).startOf('day').toDate(),
        $lte: DateUtils.utc(request.to).endOf('day').toDate(),
      };
    }

    if (request.memberIds.length > 0) {
      query.memberId = { $in: request.memberIds };
    }

    if (request.filters.category?.length) {
      query.category = { $in: request.filters.category as CategoryEnum[] };
    }

    const [{ data, allDebt, allExpenses, count, allDebtIncome, allIncome }] =
      await this.getCollection()
        .rawCollection()
        .aggregate<FindPaginatedMovementsAggregationResult>([
          { $match: query },
          {
            $facet: {
              allDebt: this._getGroupedByCategoryType(CategoryTypeEnum.Debt),
              allDebtIncome: this._getAllDebtIncome(),
              allExpenses: this._getGroupedByCategoryType(
                CategoryTypeEnum.Expense,
              ),
              allIncome: this._getGroupedByCategoryType(
                CategoryTypeEnum.Income,
              ),
              data: [
                ...this.getPaginatedPipelineQuery(request),
                ...this._getUsersLookup(),
                ...this._getProfessorsLookup(),
                ...this._getEmployeesLookup(),
                ...this._getServicesLookup(),
                ...this._getMemberMovementsLookup(),
                this._projectMovements(),
              ],
              total: [{ $count: 'count' }],
            },
          },
          {
            $project: {
              allDebt: MongoUtils.elementAtArray0('$allDebt.amount', 0),
              allDebtIncome: MongoUtils.elementAtArray0(
                '$allDebtIncome.amount',
                0,
              ),
              allExpenses: MongoUtils.elementAtArray0('$allExpenses.amount', 0),
              allIncome: MongoUtils.elementAtArray0('$allIncome.amount', 0),
              count: MongoUtils.elementAtArray0('$total.count', 0),
              data: 1,
            },
          },
        ])
        .toArray();

    let debt = 0;

    let balance = 0;

    if (request.memberIds.length > 0) {
      debt = allDebt;

      balance = allIncome - debt;
    } else if (allExpenses === 0) {
      debt = allDebt;

      balance = allIncome - debt;
    } else {
      balance = allIncome - allExpenses;

      debt = allDebt - allDebtIncome;
    }

    return {
      balance,
      count,
      data,
      debt,
      expenses: allExpenses,
      income: allIncome,
    };
  }

  protected getCollection(): MongoCollection<Movement> {
    return MovementCollection;
  }

  protected getSchema(): SimpleSchema {
    return MovementSchema;
  }

  private _getAllDebtIncome() {
    return [
      {
        $match: {
          category: {
            $in: [
              CategoryEnum.MembershipIncome,
              CategoryEnum.GuestIncome,
              CategoryEnum.ElectricityIncome,
            ],
          },
        },
      },
      MongoUtils.getGroupByAmount(),
    ];
  }

  private _getEmployeesLookup() {
    return [
      {
        $lookup: {
          as: 'employee',
          foreignField: '_id',
          from: 'employees',
          localField: 'employeeId',
          pipeline: [
            {
              $lookup: {
                as: 'user',
                foreignField: '_id',
                from: 'users',
                localField: 'userId',
              },
            },
            {
              $unwind: '$user',
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$employee',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }

  private _getGroupedByCategoryType(type: CategoryTypeEnum) {
    return [{ $match: { type } }, MongoUtils.getGroupByAmount()];
  }

  private _getMemberMovementsLookup() {
    return [
      {
        $lookup: {
          as: 'movements',
          foreignField: 'memberId',
          from: 'movements',
          localField: 'memberId',
          pipeline: [{ $match: { $expr: { $eq: ['$isDeleted', false] } } }],
        },
      },
    ];
  }

  private _getProfessorsLookup() {
    return [
      {
        $lookup: {
          as: 'professor',
          foreignField: '_id',
          from: 'professors',
          localField: 'professorId',
          pipeline: [
            {
              $lookup: {
                as: 'user',
                foreignField: '_id',
                from: 'users',
                localField: 'userId',
              },
            },
            {
              $unwind: '$user',
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$professor',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }

  private _getServicesLookup() {
    return [
      {
        $lookup: {
          as: 'service',
          foreignField: '_id',
          from: 'services',
          localField: 'serviceId',
        },
      },
      {
        $unwind: {
          path: '$service',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }

  private _getUsersLookup() {
    return [
      {
        $lookup: {
          as: 'member',
          foreignField: '_id',
          from: 'members',
          localField: 'memberId',
          pipeline: [
            {
              $lookup: {
                as: 'user',
                foreignField: '_id',
                from: 'users',
                localField: 'userId',
              },
            },
            {
              $unwind: '$user',
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$member',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }

  private _projectMovements() {
    return { $project: { movements: 0 } };
  }

  private _reduceMovementsByCategoryType(type: CategoryTypeEnum) {
    return {
      $reduce: {
        in: {
          $add: [
            '$$value',
            {
              $sum: {
                $cond: [
                  {
                    $eq: ['$$this.type', type],
                  },
                  '$$this.amount',
                  0,
                ],
              },
            },
          ],
        },
        initialValue: 0,
        input: '$movements',
      },
    };
  }
}
