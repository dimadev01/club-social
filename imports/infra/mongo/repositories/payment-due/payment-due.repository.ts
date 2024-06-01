import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { PaymentDue } from '@domain/payment-dues/entities/payment-due.entity';
import { IPaymentDuePort } from '@domain/payment-dues/payment-due.port';
import {
  PaymentDueCollectionOld,
  PaymentDueSchema,
} from '@infra/mongo/collections/payment-due.collection.old';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.old';
import { MongoCrudRepositoryOld } from '@infra/mongo/repositories/mongo-crud.repository';

@injectable()
export class PaymentDueRepository
  extends MongoCrudRepositoryOld<PaymentDue>
  implements IPaymentDuePort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger,
  ) {
    super(_logger);
  }

  public findByPayment(paymentId: string): Promise<PaymentDue[]> {
    return this.getCollection()
      .find({ isDeleted: false, paymentId })
      .fetchAsync();
  }

  public findByPayments(paymentIds: string[]): Promise<PaymentDue[]> {
    return this.getCollection()
      .find({ _id: { $in: paymentIds }, isDeleted: false })
      .fetchAsync();
  }

  protected getCollection(): MongoCollection<PaymentDue> {
    return PaymentDueCollectionOld;
  }

  protected getSchema(): SimpleSchema {
    return PaymentDueSchema;
  }
}
