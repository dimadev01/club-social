import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Member } from '@domain/members/member.entity';
import { MembersCollection } from '@domain/members/members.collection';
import {
  MemberCategory,
  MemberFileStatus,
  MemberStatus,
} from '@domain/members/members.enum';
import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';
import { PaginatedRequestDto } from '@kernel/paginated-request.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

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
            data: this.getPaginatedPipeline({
              $sort: { createdAt: -1 },
              page: request.page,
              pageSize: request.pageSize,
            }),
            total: [{ $count: 'count' }],
          },
        },
      ])
      .toArray();

    return ok<PaginatedResponse<MemberGridDto>>({
      count: total.length > 0 ? total[0].count : 0,
      data: data
        .map((member: Member) => plainToInstance(Member, member))
        .map((member: Member) => ({
          _id: member._id,
          category: member.category,
          dateOfBirth: member.dateOfBirthString,
          emails: member.user.emails,
          fileStatus: member.fileStatus,
          // @ts-ignore
          name: `${member.user.profile?.firstName ?? ''} ${
            // @ts-ignore
            member.user.profile?.lastName ?? ''
          }`,
          status: member.status,
        })),
    });
  }
}
