import { Mongo } from 'meteor/mongo';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { Member } from '@domain/members/entities/member.entity';
import { MembersCollection } from '@domain/members/member.collection';
import { IMemberPort } from '@domain/members/member.port';
import { DIToken } from '@infra/di/di-tokens';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

@injectable()
export class MemberRepository
  extends MongoCrudRepository<Member>
  implements IMemberPort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger
  ) {
    super(_logger);
  }

  public async findPaginated(
    request: PaginatedRequestDto
  ): Promise<PaginatedResponse<Member>> {
    const query: Mongo.Query<Member> = {
      isDeleted: false,
    };

    const options = this.createPaginatedQueryOptions(
      request.page,
      request.pageSize
    );

    return {
      count: await this.getCollection().find(query).countAsync(),
      data: await this.getCollection().find(query, options).fetchAsync(),
    };
  }

  protected getCollection(): MongoCollection<Member> {
    return MembersCollection;
  }
}
