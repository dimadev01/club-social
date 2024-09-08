import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import {
  GetAvailableResponse,
  IMemberCreditRepository,
} from '@application/members/repositories/member-credit.repository';
import { MemberCreditTypeEnum } from '@domain/members/member.enum';
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
    @inject(DIToken.ILoggerService)
    protected readonly logger: ILoggerService,
    protected readonly collection: MemberCreditCollection,
    protected readonly mapper: MemberCreditMapper,
  ) {
    super(collection, mapper, logger);
  }

  public async findByPayment(paymentId: string): Promise<MemberCredit[]> {
    const entities = await this.collection
      .find({ isDeleted: false, paymentId })
      .fetchAsync();

    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  public async getAvailable(memberId: string): Promise<GetAvailableResponse> {
    function groupByType(type: MemberCreditTypeEnum) {
      return {
        $sum: {
          $cond: [{ $eq: ['$type', type] }, '$amount', 0],
        },
      };
    }

    const [result] = await this.collection
      .rawCollection()
      .aggregate<GetAvailableResponse>()
      .match({ isDeleted: false, memberId })
      .group({
        _id: null,
        credits: groupByType(MemberCreditTypeEnum.CREDIT),
        debits: groupByType(MemberCreditTypeEnum.DEBIT),
      })
      .project({
        _id: 0,
        amount: { $subtract: ['$credits', '$debits'] },
      })
      .toArray();

    return result ? { amount: result.amount } : { amount: 0 };
  }
}
