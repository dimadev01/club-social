import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import { IMemberCreditRepository } from '@domain/members/member-credit.repository';
import { MemberCredit } from '@domain/members/models/member-credit.model';
import { MemberCreditCollection } from '@infra/mongo/collections/member-credit.collection';
import { MemberCreditEntity } from '@infra/mongo/entities/member-credit.entity';
import { MemberCreditMapper } from '@infra/mongo/mappers/member-credit.mapper';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';

@injectable()
export class MemberCreditMongoRepository
  extends CrudMongoRepository<MemberCredit, MemberCreditEntity>
  implements IMemberCreditRepository
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    protected readonly collection: MemberCreditCollection,
    protected readonly mapper: MemberCreditMapper,
  ) {
    super(collection, mapper, logger);
  }

  public async findByPayment(paymentId: string): Promise<MemberCredit[]> {
    const entities = await this.collection
      .find({
        isDeleted: false,
        paymentId,
      })
      .fetchAsync();

    return entities.map((entity) => this.mapper.toDomain(entity));
  }
}
