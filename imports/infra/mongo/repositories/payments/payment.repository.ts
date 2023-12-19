import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { Payment } from '@domain/payments/entities/payment.entity';
import {
  PaymentCollection,
  PaymentSchema,
} from '@domain/payments/payment.collection';
import { IPaymentPort } from '@domain/payments/payment.port';
import { DIToken } from '@infra/di/di-tokens';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';
import { FindPaginatedDuesRequest } from '@infra/mongo/repositories/dues/due-repository.types';

@injectable()
export class PaymentRepository
  extends MongoCrudRepository<Payment>
  implements IPaymentPort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger
  ) {
    super(_logger);
  }

  findPaginated(
    request: FindPaginatedDuesRequest
  ): Promise<FindPaginatedResponse<Payment>> {
    console.log(request);

    throw new Error('Method not implemented.');
  }

  protected getCollection(): MongoCollection<Payment> {
    return PaymentCollection;
  }

  protected getSchema(): SimpleSchema {
    return PaymentSchema;
  }
}
