import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { PaymentDue } from '@domain/payment-dues/entities/payment-due.entity';
import { IPaymentDuePort } from '@domain/payment-dues/payment-due.port';
import { DIToken } from '@infra/di/di-tokens';
import {
  PaymentDueCollection,
  PaymentDueSchema,
} from '@infra/mongo/collections/payment-due.collection';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';

@injectable()
export class PaymentDueRepository
  extends MongoCrudRepository<PaymentDue>
  implements IPaymentDuePort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger,
  ) {
    super(_logger);
  }

  protected getCollection(): MongoCollection<PaymentDue> {
    return PaymentDueCollection;
  }

  protected getSchema(): SimpleSchema {
    return PaymentDueSchema;
  }
}
