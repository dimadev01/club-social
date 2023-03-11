import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import find from 'lodash/find';
import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import {
  CategoryEnum,
  MemberCategories,
} from '@domain/categories/categories.enum';
import { Movement } from '@domain/movements/movement.entity';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { GetMovementsGridRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.request.dto';
import { GetMovementsGridResponseDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.response.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetMovementsUseCase
  extends UseCase<GetMovementsGridRequestDto>
  implements
    IUseCase<GetMovementsGridRequestDto, PaginatedResponse<MovementGridDto>>
{
  public async execute(
    request: GetMovementsGridRequestDto
  ): Promise<Result<PaginatedResponse<MovementGridDto>, Error>> {
    await this.validateDto(GetMovementsGridRequestDto, request);

    const $match: Mongo.Query<Movement> = {
      isDeleted: false,
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

    if (request.filters?.rentalId?.length) {
      $match.rentalId = { $in: request.filters.rentalId as string[] };
    }

    // @ts-expect-error
    const [{ data, total, totals }] = await MovementsCollection.rawCollection()
      .aggregate<Movement>([
        {
          $match,
        },
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
            as: 'rental',
            foreignField: '_id',
            from: 'rentals',
            localField: 'rentalId',
          },
        },
        {
          $unwind: {
            path: '$rental',
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
        {
          $facet: {
            data: this.getPaginatedPipeline({
              $sort: { date: -1 },
              page: request.page,
              pageSize: request.pageSize,
            }),
            total: [{ $count: 'count' }],
            totals: [
              {
                $group: {
                  _id: '$type',
                  sum: {
                    $sum: '$amount',
                  },
                },
              },
            ],
          },
        },
      ])
      .toArray();

    const income = find(totals, { _id: 'income' })?.sum ?? 0;

    const expense = find(totals, { _id: 'expense' })?.sum ?? 0;

    const debt = income - (find(totals, { _id: 'debt' })?.sum ?? 0);

    const balance = income - expense;

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
          } else if (movement.category === CategoryEnum.Rental) {
            details = movement.rental?.name ?? '';
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
