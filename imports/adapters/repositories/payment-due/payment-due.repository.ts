import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';

import {
  PaymentDueCollectionOld,
  PaymentDueSchema,
} from '@adapters/mongo/collections/payment-due.collection.old';
import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { MongoCrudRepositoryOld } from '@adapters/repositories/mongo-crud.repository';
import { ILogger } from '@domain/common/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { PaymentDueOld } from '@domain/payment-dues/entities/payment-due.entity';
import { IPaymentDuePort } from '@domain/payment-dues/payment-due.port';

@injectable()
export class PaymentDueRepository
  extends MongoCrudRepositoryOld<PaymentDueOld>
  implements IPaymentDuePort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger,
  ) {
    super(_logger);
  }

  public findByPayment(paymentId: string): Promise<PaymentDueOld[]> {
    return this.getCollection()
      .find({ isDeleted: false, paymentId })
      .fetchAsync();
  }

  public findByPayments(paymentIds: string[]): Promise<PaymentDueOld[]> {
    return this.getCollection()
      .find({ _id: { $in: paymentIds }, isDeleted: false })
      .fetchAsync();
  }

  protected getCollection(): MongoCollectionOld<PaymentDueOld> {
    return PaymentDueCollectionOld;
  }

  protected getSchema(): SimpleSchema {
    return PaymentDueSchema;
  }
}
