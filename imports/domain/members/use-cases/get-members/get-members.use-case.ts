import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { Member } from '@domain/members/entities/member.entity';
import { MembersCollection } from '@domain/members/member.collection';
import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMembersUseCase
  extends UseCase
  implements IUseCase<null, GetMembersDto[]>
{
  public async execute(): Promise<Result<GetMembersDto[], Error>> {
    const $match: Mongo.Query<Member> = {
      isDeleted: false,
    };

    const data = await MembersCollection.rawCollection()
      .aggregate([
        { $match },
        {
          $lookup: {
            as: 'user',
            foreignField: '_id',
            from: 'users',
            localField: 'userId',
          },
        },
        { $unwind: '$user' },
        { $sort: { 'user.profile.lastName': 1 } },
      ])
      .map((member) => plainToInstance(Member, member))
      .toArray();

    return ok<GetMembersDto[]>(
      data.map((member) => ({
        _id: member._id,
        category: member.category,
        name: member.name,
        status: member.status,
      }))
    );
  }
}
