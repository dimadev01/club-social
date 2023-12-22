import { plainToInstance } from 'class-transformer';
import { orderBy } from 'lodash';
import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { Payment } from '@domain/payments/entities/payment.entity';
import {
  PaymentCollection,
  PaymentSchema,
} from '@domain/payments/payment.collection';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { IPaymentPort } from '@domain/payments/payment.port';
import { DIToken } from '@infra/di/di-tokens';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';
import { FindPaginatedPaymentsRequest } from '@infra/mongo/repositories/payments/payment-repository.types';
import { DateUtils } from '@shared/utils/date.utils';
import { MongoUtils } from '@shared/utils/mongo.utils';

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

  public async findPaginated(
    request: FindPaginatedPaymentsRequest
  ): Promise<FindPaginatedResponse<Payment>> {
    const query: Mongo.Query<Payment> = {
      isDeleted: request.showDeleted ?? false,
    };

    if (request.from && request.to) {
      query.date = {
        $gte: DateUtils.utc(request.from).startOf('day').toDate(),
        $lte: DateUtils.utc(request.to).endOf('day').toDate(),
      };
    }

    if (request.memberIds.length > 0) {
      query['member._id'] = { $in: request.memberIds };
    }

    if (request.filters.category?.length) {
      query.category = { $in: request.filters.category as DueCategoryEnum[] };
    }

    if (request.filters.status?.length) {
      query.status = { $in: request.filters.status as PaymentStatusEnum[] };
    }

    const [result] = await this.getCollection()
      .rawCollection()
      .aggregate<FindPaginatedAggregationResult<Payment>>([
        { $match: query },
        {
          $facet: {
            data: [...this.getPaginatedPipelineQuery(request)],
            total: [{ $count: 'count' }],
          },
        },
        {
          $project: {
            count: MongoUtils.first('$total.count', 0),
            data: 1,
          },
        },
      ])
      .toArray();

    return {
      count: result.count,
      data: result.data.map((item) =>
        plainToInstance(Payment, {
          ...item,
          dues: orderBy(item.dues, 'due.date', 'asc'),
        })
      ),
    };
  }

  protected getCollection(): MongoCollection<Payment> {
    return PaymentCollection;
  }

  protected getSchema(): SimpleSchema {
    return PaymentSchema;
  }
}
