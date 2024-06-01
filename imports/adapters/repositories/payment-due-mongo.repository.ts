import { inject, injectable } from 'tsyringe';

import { PaymentDueMapper } from '@adapters/mappers/payment-due.mapper';
import { PaymentDueCollection } from '@adapters/mongo/collections/payment-due.collection';
import { PaymentDueEntity } from '@adapters/mongo/entities/payment-due.entity';
import { CrudMongoRepository } from '@adapters/repositories/crud-mongo.repository';
import { ILogger } from '@application/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { PaymentDueModel } from '@domain/payment-dues/models/payment-due.model';
import { IPaymentDueRepository } from '@domain/payment-dues/repositories/payment-due-repository.interface';

@injectable()
export class PaymentDueMongoRepository
  extends CrudMongoRepository<PaymentDueModel, PaymentDueEntity>
  implements IPaymentDueRepository
{
  public constructor(
    @inject(PaymentDueCollection)
    protected readonly collection: PaymentDueCollection,
    @inject(PaymentDueMapper)
    protected readonly mapper: PaymentDueMapper,
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
  ) {
    super(collection, mapper, logger);
  }

  public async findByPayment(paymentId: string): Promise<PaymentDueModel[]> {
    const entities = await this.collection
      .find({ isDeleted: false, paymentId })
      .fetchAsync();

    return entities.map((entity) => this.mapper.toModel(entity));
  }

  public async findByPayments(
    paymentIds: string[],
  ): Promise<PaymentDueModel[]> {
    const entities = await this.collection
      .find({ isDeleted: false, paymentId: { $in: paymentIds } })
      .fetchAsync();

    return entities.map((entity) => this.mapper.toModel(entity));
  }
}
