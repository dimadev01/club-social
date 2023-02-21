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
