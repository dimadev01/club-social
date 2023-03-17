import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Member } from '@domain/members/member.entity';
import { MembersCollection } from '@domain/members/members.collection';
import { MemberStatus } from '@domain/members/members.enum';
import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetMembersUseCase
  extends UseCase
  implements IUseCase<undefined, GetMembersDto[]>
{
  public async execute(): Promise<Result<GetMembersDto[], Error>> {
    const $match: Mongo.Query<Member> = {
      isDeleted: false,
      status: MemberStatus.Active,
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
      data.map((member) => ({ _id: member._id, name: member.name }))
    );
  }
}
