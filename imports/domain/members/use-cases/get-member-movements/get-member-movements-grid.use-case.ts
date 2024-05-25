import { plainToInstance } from 'class-transformer';
import find from 'lodash/find';
import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import {
  CategoryEnum,
  CategoryTypeEnum,
} from '@domain/categories/category.enum';
import { MemberMovementGridDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.dto';
import { GetMemberMovementsGridRequestDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.request.dto';
import { GetMemberMovementsGridResponseDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.response.dto';
import { Movement } from '@domain/movements/entities/movement.entity';
import { MovementCollection } from '@domain/movements/movement.collection';
import { UseCase } from '@infra/use-cases/use-case';
import { DateUtils } from '@shared/utils/date.utils';

@injectable()
export class GetMemberMovementsUseCase
  extends UseCase<GetMemberMovementsGridRequestDto>
  implements
    IUseCase<
      GetMemberMovementsGridRequestDto,
      GetMemberMovementsGridResponseDto
    >
{
  public async execute(
    request: GetMemberMovementsGridRequestDto,
  ): Promise<Result<GetMemberMovementsGridResponseDto, Error>> {
    const $match: Mongo.Query<Movement> = {
      isDeleted: false,
      memberId: request.memberId,
    };

    if (request.from && request.to) {
      $match.date = {
        $gte: DateUtils.utc(request.from).startOf('day').toDate(),
        $lte: DateUtils.utc(request.to).endOf('day').toDate(),
      };
    }

    if (request.filters?.category?.length) {
      $match.category = { $in: request.filters.category as CategoryEnum[] };
    }

    // @ts-expect-error
    const [{ data, total, totals }] = await MovementCollection.rawCollection()
      .aggregate<Movement>([
        {
          $match,
        },
        {
          $facet: {
            data: [
              ...this.getPaginatedPipeline({
                $sort: { date: -1 },
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
            ],
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

    const income = find(totals, { _id: CategoryTypeEnum.Income })?.sum ?? 0;

    const debt = find(totals, { _id: CategoryTypeEnum.Debt })?.sum ?? 0;

    const balance = income - debt;

    const count = total.length > 0 ? total[0].count : 0;

    return ok<GetMemberMovementsGridResponseDto>({
      balance,
      count,
      data: data
        .map((movement: Movement) => plainToInstance(Movement, movement))
        .map(
          (movement: Movement): MemberMovementGridDto => ({
            _id: movement._id,
            amount: movement.amountFormatted,
            category: movement.category,
            date: movement.dateFormatted,
            type: movement.type,
          }),
        ),
      debt,
      income,
    });
  }
}
