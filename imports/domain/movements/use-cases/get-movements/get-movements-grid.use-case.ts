import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import find from 'lodash/find';
import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import {
  CategoryEnum,
  CategoryTypeEnum,
  MemberCategories,
} from '@domain/categories/category.enum';
import { Movement } from '@domain/movements/entities/movement.entity';
import { MovementCollection } from '@domain/movements/movement.collection';
import { IMovementPort } from '@domain/movements/movement.port';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { GetMovementsGridRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.request.dto';
import { GetMovementsGridResponseDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.response.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMovementsUseCase
  extends UseCase<GetMovementsGridRequestDto>
  implements IUseCase<GetMovementsGridRequestDto, GetMovementsGridResponseDto>
{
  public constructor(
    @inject(DIToken.MovementRepository)
    private readonly _movementPort: IMovementPort
  ) {
    super();
  }

  public async execute(
    request: GetMovementsGridRequestDto
  ): Promise<Result<GetMovementsGridResponseDto, Error>> {
    await this.validateDto(GetMovementsGridRequestDto, request);

    const $match: Mongo.Query<Movement> = {
      isDeleted: request.showDeleted ?? false,
    };

    if (request.from && request.to) {
      $match.date = {
        $gte: dayjs.utc(request.from).startOf('day').toDate(),
        $lte: dayjs.utc(request.to).endOf('day').toDate(),
      };
    }

    if (request.memberId) {
      $match.memberId = request.memberId;
    }

    if (request.filters?.category?.length) {
      $match.category = { $in: request.filters.category as CategoryEnum[] };
    }

    if (request.filters?.professorId?.length) {
      $match.professorId = { $in: request.filters.professorId as string[] };
    }

    if (request.filters?.employeeId?.length) {
      $match.employeeId = { $in: request.filters.employeeId as string[] };
    }

    // @ts-expect-error
    const [{ data, total, totalsByType, debtIncome }] =
      await MovementCollection.rawCollection()
        .aggregate<Movement>([
          {
            $match,
          },
          {
            $facet: {
              data: [
                ...this.getPaginatedPipeline({
                  $sort: {
                    [request.sortField]: this.getSorterValue(request.sortOrder),
                  },
                  page: request.page,
                  pageSize: request.pageSize,
                }),
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
              ],
              debtIncome: [
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
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: '$amount',
                    },
                  },
                },
              ],
              total: [{ $count: 'count' }],
              totalsByType: [
                { $group: { _id: '$type', amount: { $sum: '$amount' } } },
              ],
            },
          },
        ])
        .toArray();

    const income =
      find(totalsByType, { _id: CategoryTypeEnum.Income })?.amount ?? 0;

    const expense =
      find(totalsByType, { _id: CategoryTypeEnum.Expense })?.amount ?? 0;

    const totalDebt =
      find(totalsByType, { _id: CategoryTypeEnum.Debt })?.amount ?? 0;

    const balance = income - expense;

    const debt = totalDebt - (debtIncome.length > 0 ? debtIncome[0].amount : 0);

    const count = total.length > 0 ? total[0].count : 0;

    return ok<GetMovementsGridResponseDto>({
      balance,
      count,
      data: data
        .map((movement: Movement) => plainToInstance(Movement, movement))
        .map((movement: Movement): MovementGridDto => {
          let details = '';

          if (MemberCategories.includes(movement.category)) {
            details = movement.member?.name ?? '';
          } else if (movement.category === CategoryEnum.Employee) {
            details = movement.employee?.name ?? '';
          } else if (movement.category === CategoryEnum.Professor) {
            details = movement.professor?.name ?? '';
          } else if (movement.category === CategoryEnum.Service) {
            details = movement.service?.name ?? '';
          } else {
            details = movement.notes ?? '';
          }

          return {
            _id: movement._id,
            amount: movement.amountFormatted,
            category: movement.category,
            date: movement.dateFormatted,
            details,
            isDeleted: movement.isDeleted,
            memberId: movement.memberId,
            type: movement.type,
          };
        }),
      debt,
      expense,
      income,
    });
  }
}
