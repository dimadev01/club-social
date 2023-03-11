import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import find from 'lodash/find';
import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { CategoryEnum } from '@domain/categories/categories.enum';
import { Movement } from '@domain/movements/movement.entity';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { MovementByMemberGridDto } from '@domain/movements/use-cases/get-movements-by-member/get-movements-by-member-grid.dto';
import { GetMovementsByMemberGridRequestDto } from '@domain/movements/use-cases/get-movements-by-member/get-movements-by-member-grid.request.dto';
import { GetMovementsByMemberGridResponseDto } from '@domain/movements/use-cases/get-movements-by-member/get-movements-by-member-grid.response.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetMovementsByMemberUseCase
  extends UseCase<GetMovementsByMemberGridRequestDto>
  implements
    IUseCase<
      GetMovementsByMemberGridRequestDto,
      PaginatedResponse<MovementByMemberGridDto>
    >
{
  public async execute(
    request: GetMovementsByMemberGridRequestDto
  ): Promise<Result<PaginatedResponse<MovementByMemberGridDto>, Error>> {
    await this.validateDto(GetMovementsByMemberGridRequestDto, request);

    const $match: Mongo.Query<Movement> = {
      isDeleted: false,
      memberId: request.memberId,
    };

    if (request.from && request.to) {
      $match.date = {
        $gte: dayjs.utc(request.from).startOf('day').toDate(),
        $lte: dayjs.utc(request.to).endOf('day').toDate(),
      };
    }

    if (request.filters?.category?.length) {
      $match.category = { $in: request.filters.category as CategoryEnum[] };
    }

    // @ts-expect-error
    const [{ data, total, totals }] = await MovementsCollection.rawCollection()
      .aggregate<Movement>([
        {
          $match,
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

    return ok<GetMovementsByMemberGridResponseDto>({
      balance,
      count,
      data: data
        .map((movement: Movement) => plainToInstance(Movement, movement))
        .map(
          (movement: Movement): MovementByMemberGridDto => ({
            _id: movement._id,
            amount: movement.amountFormatted,
            category: movement.category,
            date: movement.dateFormatted,
            memberId: movement.memberId,
            type: movement.type,
          })
        ),
      debt,
      expense,
      income,
    });
  }
}
