import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { IMemberRepository } from '@domain/members/member-repository.interface';
import { MemberModel } from '@domain/members/models/member.model';
import { DIToken } from '@infra/di/di-tokens';
import { MemberMapper } from '@infra/mappers/member.mapper';
import { MemberCollection } from '@infra/mongo/collections/member.collection';
import { MemberEntity } from '@infra/mongo/entities/members/member.entity';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';

@injectable()
export class MemberMongoRepository
  extends CrudMongoRepository<MemberModel, MemberEntity>
  implements IMemberRepository
{
  public constructor(
    @inject(MemberCollection)
    protected readonly collection: MemberCollection,
    @inject(MemberMapper)
    protected readonly mapper: MemberMapper,
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
  ) {
    super(collection, mapper, logger);
  }
}
