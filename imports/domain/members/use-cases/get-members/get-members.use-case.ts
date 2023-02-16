import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Member } from '@domain/members/member.entity';
import { MembersCollection } from '@domain/members/members.collection';
import { GetMembersRequestDto } from '@domain/members/use-cases/get-members/get-members-request.dto';
import { MemberGridDto } from '@domain/members/use-cases/get-members/member-grid.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetMembersUseCase
  extends UseCase<GetMembersRequestDto>
  implements IUseCase<GetMembersRequestDto, PaginatedResponse<MemberGridDto>>
{
  public async execute(
    request: GetMembersRequestDto
  ): Promise<Result<PaginatedResponse<MemberGridDto>, Error>> {
    await this.validateDto(GetMembersRequestDto, request);

    const query: Mongo.Query<Member> = {};

    const membersAggregate: Member[] = await MembersCollection.rawCollection()
      .aggregate([
        {
          $match: query,
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: (request.page - 1) * request.pageSize,
        },
        {
          $limit: request.pageSize,
        },
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
      ])
      .map((member: Member) => plainToInstance(Member, member))
      .toArray();

    return ok<PaginatedResponse<MemberGridDto>>({
      data: membersAggregate.map((member) => ({
        _id: member._id,
        dateOfBirth: member.dateOfBirthString,
        email: member.user.emails?.[0].address ?? '',
        // @ts-ignore
        name: `${member.user.profile?.firstName ?? ''} ${
          // @ts-ignore
          member.user.profile?.lastName ?? ''
        }`,
      })),
      total: await MembersCollection.find(query).countAsync(),
    });
  }
}
