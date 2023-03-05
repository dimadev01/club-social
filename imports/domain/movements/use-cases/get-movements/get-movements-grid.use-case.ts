import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { CategoryEnum } from '@domain/categories/categories.enum';
import { Movement } from '@domain/movements/movement.entity';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { GetMovementsGridRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.request.dto';
import { GetMovementsGridResponseDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.response.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';
import { CurrencyUtils } from '@shared/utils/currency.utils';

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

    if (request.memberId) {
      $match.memberId = request.memberId;
    }

    if (request.filters?.category?.length) {
      $match.category = { $in: request.filters.category as CategoryEnum[] };
    }

    if (request.amountFilter.some((value) => value !== 0)) {
      $match.amount = {
        $gte: CurrencyUtils.toCents(request.amountFilter[0]),
        $lte: CurrencyUtils.toCents(request.amountFilter[1]),
      };
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
                  _id: null,
                  balance: { $sum: '$amount' },
                  income: {
                    $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] },
                  },
                  outcome: {
                    $sum: { $cond: [{ $lt: ['$amount', 0] }, '$amount', 0] },
                  },
                },
              },
            ],
          },
        },
      ])
      .toArray();

    const $explain = await MovementsCollection.rawCollection()
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
                  _id: null,
                  balance: { $sum: '$amount' },
                  income: {
                    $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] },
                  },
                  outcome: {
                    $sum: { $cond: [{ $lt: ['$amount', 0] }, '$amount', 0] },
                  },
                },
              },
            ],
          },
        },
      ])
      .explain();

    const balance = totals.length > 0 ? totals[0].balance : 0;

    const outcome = totals.length > 0 ? totals[0].outcome : 0;

    const income = totals.length > 0 ? totals[0].income : 0;

    const count = total.length > 0 ? total[0].count : 0;

    return ok<GetMovementsGridResponseDto>({
      $explain,
      balance,
      count,
      data: data
        .map((movement: Movement) => plainToInstance(Movement, movement))
        .map((movement: Movement) => {
          let details = '';

          if (movement.category === CategoryEnum.Membership) {
            details = movement.member?.name ?? '';
          }

          return {
            _id: movement._id,
            amount: movement.amountFormatted,
            category: movement.category,
            date: movement.dateFormatted,
            details,
            memberId: movement.memberId,
          };
        }),
      income,
      outcome,
    });
  }
}
