import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Member } from '@domain/members/member.entity';
import { MembersCollection } from '@domain/members/members.collection';
import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetMembersUseCase
  extends UseCase<object>
  implements IUseCase<undefined, GetMembersDto[]>
{
  public async execute(): Promise<Result<GetMembersDto[], Error>> {
    const query: Mongo.Query<Member> = { isDeleted: false };

    const data = await MembersCollection.find(query, {
      sort: { firstName: 1 },
    }).fetchAsync();

    return ok<GetMembersDto[]>(
      data.map((member) => ({ _id: member._id, name: member.name }))
    );
  }
}
