import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { PaginatedRequestDto } from '@application/common/paginated-request.dto';
import { PaginatedResponse } from '@application/common/paginated-response.dto';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { CategoryEnum } from '@domain/categories/categories.enum';
import { Member } from '@domain/members/member.entity';
import { MembersCollection } from '@domain/members/members.collection';
import {
  MemberCategory,
  MemberFileStatus,
  MemberStatus,
} from '@domain/members/members.enum';
import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';

@injectable()
export class GetMembersGridUseCase
  extends UseCase<PaginatedRequestDto>
  implements IUseCase<PaginatedRequestDto, PaginatedResponse<MemberGridDto>>
{
  public async execute(
    request: PaginatedRequestDto
  ): Promise<Result<PaginatedResponse<MemberGridDto>, Error>> {
    await this.validateDto(PaginatedRequestDto, request);

    const $match: Mongo.Query<Member> = {
      isDeleted: false,
    };

    if (request.filters?.fileStatus?.length) {
      $match.fileStatus = {
        $in: request.filters.fileStatus as MemberFileStatus[],
      };
    }

    if (request.filters?.status?.length) {
      $match.status = { $in: request.filters.status as MemberStatus[] };
    }

    if (request.filters?.category?.length) {
      $match.category = { $in: request.filters.category as MemberCategory[] };
    }

    const $userLookupPipeline: Mongo.Query<Meteor.User> = [];

    if (request.search) {
      $userLookupPipeline.push({
        $match: {
          $or: [
            { 'profile.firstName': { $options: 'i', $regex: request.search } },
            { 'profile.lastName': { $options: 'i', $regex: request.search } },
            { 'emails.address': { $options: 'i', $regex: request.search } },
          ],
        },
      });
    }

    // @ts-expect-error
    const [{ data, total }] = await MembersCollection.rawCollection()
      .aggregate<Member>([
        {
          $match,
        },
        {
          $lookup: {
            as: 'user',
            foreignField: '_id',
            from: 'users',
            localField: 'userId',
            pipeline: $userLookupPipeline,
          },
        },
        {
          $unwind: '$user',
        },
        {
          $facet: {
            data: [
              ...this.getPaginatedPipeline({
                $sort: { 'user.profile.lastName': 1 },
                page: request.page,
                pageSize: request.pageSize,
              }),
              {
                $lookup: {
                  as: 'movements',
                  foreignField: 'memberId',
                  from: 'movements',
                  localField: '_id',
                },
              },
              {
                $addFields: {
                  electricityBalance: {
                    $subtract: [
                      {
                        $reduce: {
                          in: {
                            $add: [
                              '$$value',
                              {
                                $sum: {
                                  $cond: [
                                    {
                                      $eq: [
                                        '$$this.category',
                                        CategoryEnum.ElectricityIncome,
                                      ],
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
                      },
                      {
                        $reduce: {
                          in: {
                            $add: [
                              '$$value',
                              {
                                $sum: {
                                  $cond: [
                                    {
                                      $eq: [
                                        '$$this.category',
                                        CategoryEnum.ElectricityDebt,
                                      ],
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
                      },
                    ],
                  },

                  guestBalance: {
                    $subtract: [
                      {
                        $reduce: {
                          in: {
                            $add: [
                              '$$value',
                              {
                                $sum: {
                                  $cond: [
                                    {
                                      $eq: [
                                        '$$this.category',
                                        CategoryEnum.GuestIncome,
                                      ],
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
                      },
                      {
                        $reduce: {
                          in: {
                            $add: [
                              '$$value',
                              {
                                $sum: {
                                  $cond: [
                                    {
                                      $eq: [
                                        '$$this.category',
                                        CategoryEnum.GuestDebt,
                                      ],
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
                      },
                    ],
                  },

                  membershipBalance: {
                    $subtract: [
                      {
                        $reduce: {
                          in: {
                            $add: [
                              '$$value',
                              {
                                $sum: {
                                  $cond: [
                                    {
                                      $eq: [
                                        '$$this.category',
                                        CategoryEnum.MembershipIncome,
                                      ],
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
                      },
                      {
                        $reduce: {
                          in: {
                            $add: [
                              '$$value',
                              {
                                $sum: {
                                  $cond: [
                                    {
                                      $eq: [
                                        '$$this.category',
                                        CategoryEnum.MembershipDebt,
                                      ],
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
                      },
                    ],
                  },
                },
              },
            ],
            total: [{ $count: 'count' }],
          },
        },
      ])
      .toArray();

    return ok<PaginatedResponse<MemberGridDto>>({
      count: total.length > 0 ? total[0].count : 0,
      data: data
        .map((member: Member) => plainToInstance(Member, member))
        .map(
          (
            member: Member & {
              electricityBalance: number;
              guestBalance: number;
              membershipBalance: number;
            }
          ): MemberGridDto => ({
            _id: member._id,
            category: member.category,
            electricityBalance: member.electricityBalance,
            emails: member.user.emails ?? null,
            fileStatus: member.fileStatus,
            guestBalance: member.guestBalance,
            membershipBalance: member.membershipBalance,
            // @ts-expect-error
            name: `${member.user.profile?.lastName ?? ''} ${
              // @ts-expect-error
              member.user.profile?.firstName ?? ''
            }`,
            status: member.status,
          })
        ),
    });
  }
}
