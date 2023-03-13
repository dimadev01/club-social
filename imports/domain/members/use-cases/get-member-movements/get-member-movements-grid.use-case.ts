import { plainToInstance } from 'class-transformer';
import find from 'lodash/find';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { CategoryEnum } from '@domain/categories/categories.enum';
import { MemberNotFoundError } from '@domain/members/errors/member-not-found.error';
import { MembersCollection } from '@domain/members/members.collection';
import { MemberMovementGridDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.dto';
import { GetMemberMovementsGridRequestDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.request.dto';
import { GetMemberMovementsGridResponseDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.response.dto';
import { Movement } from '@domain/movements/movement.entity';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { GetMovementsGridResponseDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.response.dto';
import { UserNotFoundError } from '@domain/users/errors/user-not-found.error';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

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
    request: GetMemberMovementsGridRequestDto
  ): Promise<Result<GetMemberMovementsGridResponseDto, Error>> {
    await this.validateDto(GetMemberMovementsGridRequestDto, request);

    const user = await Meteor.userAsync();

    if (!user) {
      return err(new UserNotFoundError());
    }

    const memberForUser = await MembersCollection.findOneAsync({
      userId: user._id,
    });

    if (!memberForUser) {
      return err(new MemberNotFoundError());
    }

    const $match: Mongo.Query<Movement> = {
      isDeleted: false,
      memberId: memberForUser._id,
    };

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

    const debt = find(totals, { _id: 'debt' })?.sum ?? 0;

    const balance = income - debt;

    const count = total.length > 0 ? total[0].count : 0;

    return ok<GetMovementsGridResponseDto>({
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
          })
        ),
      debt,
      income,
    });
  }
}
