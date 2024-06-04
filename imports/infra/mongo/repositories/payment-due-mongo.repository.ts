import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import { PaymentDue } from '@domain/payments/models/payment-due.model';
import {
  FindPaymentDueByDue,
  FindPaymentDueByPayment,
  IPaymentDueRepository,
} from '@domain/payments/payment-due.repository';
import { PaymentDueCollection } from '@infra/mongo/collections/payment-due.collection';
import { PaymentDueEntity } from '@infra/mongo/entities/payment-due.entity';
import { PaymentDueMapper } from '@infra/mongo/mappers/payment-due.mapper';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';

@injectable()
export class PaymentDueMongoRepository
  extends CrudMongoRepository<PaymentDue, PaymentDueEntity>
  implements IPaymentDueRepository
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    protected readonly collection: PaymentDueCollection,
    protected readonly mapper: PaymentDueMapper,
  ) {
    super(collection, mapper, logger);
  }

  public async findByDue(request: FindPaymentDueByDue): Promise<PaymentDue[]> {
    const entities = await this.collection
      .find({ dueId: request.dueId, isDeleted: false })
      .fetchAsync();

    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  public async findByPayment(
    request: FindPaymentDueByPayment,
  ): Promise<PaymentDue[]> {
    const entities = await this.collection
      .find({ isDeleted: false, paymentId: request.paymentId })
      .fetchAsync();

    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  public async findByPayments(paymentIds: string[]): Promise<PaymentDue[]> {
    const entities = await this.collection
      .find({ isDeleted: false, paymentId: { $in: paymentIds } })
      .fetchAsync();

    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  public async findOneByDue(dueId: string): Promise<PaymentDue | null> {
    const entity = await this.collection.findOneAsync({
      dueId,
      isDeleted: false,
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toDomain(entity);
  }
}
