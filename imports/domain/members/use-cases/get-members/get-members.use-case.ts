import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Member } from '@domain/members/member.entity';
import { MembersCollection } from '@domain/members/members.collection';
import { GetMembersRequestDto } from '@domain/members/use-cases/get-members/get-members-request.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetMembersUseCase
  extends UseCase<GetMembersRequestDto>
  implements IUseCase<GetMembersRequestDto, PaginatedResponse<Member>>
{
  public async execute(
    request: GetMembersRequestDto
  ): Promise<Result<PaginatedResponse<Member>, Error>> {
    await this.validateDto(GetMembersRequestDto, request);

    const query: Mongo.Query<Member> = {};

    const options = this.createQueryOptions(request.page, request.pageSize);

    return ok({
      data: await MembersCollection.find(query, options).fetchAsync(),
      total: await MembersCollection.find(query).countAsync(),
    });
  }
}
