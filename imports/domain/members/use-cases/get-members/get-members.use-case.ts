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

    const query: Mongo.Query<Member> = {
      isDeleted: false,
    };

    if (request.filters?.fileStatus?.length) {
      query.fileStatus = {
        $in: request.filters.fileStatus as MemberFileStatus[],
      };
    }

    if (request.filters?.status?.length) {
      query.status = {
        $in: request.filters.status as MemberStatus[],
      };
    }

    if (request.filters?.category?.length) {
      query.category = {
        $in: request.filters.category as MemberCategory[],
      };
    }

    const pipeline = [];

    pipeline.push({ $match: query });

    if (request.search) {
      pipeline.push({
        $match: {
          $expr: {
            $or: [
              {
                $regexMatch: {
                  input: '$firstName',
                  options: 'i',
                  regex: request.search,
                },
              },
              {
                $regexMatch: {
                  input: '$lastName',
                  options: 'i',
                  regex: request.search,
                },
              },
            ],
          },
        },
      });
    }

    const totalResult = await MembersCollection.rawCollection()
      .aggregate([...pipeline, { $count: 'total' }])
      .toArray();

    const membersAggregate: Member[] = await MembersCollection.rawCollection()
      .aggregate<Member>([
        ...pipeline,
        { $skip: (request.page - 1) * request.pageSize },
        { $limit: request.pageSize },
      ])
      .map((member: Member) => plainToInstance(Member, member))
      .toArray();

    return ok<PaginatedResponse<MemberGridDto>>({
      data: membersAggregate.map((member) => ({
        _id: member._id,
        category: member.category,
        dateOfBirth: member.dateOfBirthString,
        emails: member.emails ?? null,
        fileStatus: member.fileStatus,
        name: `${member.firstName ?? ''} ${member.lastName ?? ''}`,
        status: member.status,
      })),
      total: totalResult.length > 0 ? totalResult[0].total : 0,
    });
  }
}
